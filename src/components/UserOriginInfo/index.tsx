import { useEffect } from "react";
import { useContextStore } from "@/stores/contextStore";

const UserOriginInfo = () => {
  const { userOrigin, ensureUserOrigin } = useContextStore();

  useEffect(() => {
    ensureUserOrigin();
  }, []);

  const isLoading =
    !userOrigin.institutionName ||
    !userOrigin.institutionCity ||
    !userOrigin.institutionState;

  return (
    <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
      {isLoading
        ? "Carregando..."
        : `${userOrigin.institutionName} - ${userOrigin.institutionCity}, ${userOrigin.institutionState}`}
    </h2>
  );
};

export default UserOriginInfo;
