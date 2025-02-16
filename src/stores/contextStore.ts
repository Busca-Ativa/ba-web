import { create } from "zustand";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";

type UserOrigin = {
  institutionName: string | null;
  institutionId: number | null;
  institutionCity: string | null;
  institutionState: string | null;
};

interface ContextStoreState {
  userOrigin: UserOrigin;
  setUserOrigin: (userOrigin: UserOrigin) => void;
  isUserOriginEmpty: () => boolean;
  ensureUserOrigin: () => Promise<void>;
}

export const useContextStore = create<ContextStoreState>((set, get) => ({
  userOrigin: {
    institutionName: null,
    institutionId: null,
    institutionCity: null,
    institutionState: null,
  },

  setUserOrigin: (newContext) => set({ userOrigin: newContext }),

  isUserOriginEmpty: () => {
    const { userOrigin } = get();
    return !userOrigin.institutionName || userOrigin.institutionId === null;
  },

  ensureUserOrigin: async () => {
    if (get().isUserOriginEmpty()) {
      try {
        const res = await api.get(`all/user`);
        const data = res.data.institution;
        const estadoName = await getEstadoById(data.code_state);
        const cidadeName = await getCidadeById(data.code_city);

        const institution: UserOrigin = {
          institutionName: data.name,
          institutionId: data.id,
          institutionCity: cidadeName,
          institutionState: estadoName,
        };

        set({ userOrigin: institution });
      } catch (error) {
        console.error("Failed to fetch user origin", error);
      }
    }
  },
}));
