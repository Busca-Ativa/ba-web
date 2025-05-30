"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";

const BATable = dynamic(() => import("@/components/BATable"), { ssr: false });
const NewEvent = dynamic(() => import("@/components/Modals/NewEvent"), {
  ssr: false,
});
import api from "@/services/api";
import { AuthService } from "@/services/auth/auth";
import dynamic from "next/dynamic";
import SkeletonTable from "@/components/SkeletonTable";
import PageTitle from "@/components/PageTitle";

// Função para formatar datas no padrão dd/mm/aa
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

// Função para verificar se um evento já passou
const isPastEvent = (startDate: string) => {
  const [day, month, year] = startDate.split("/");
  const date = new Date(`20${year}-${month}-${day}`);
  return date < new Date();
};

const Eventos = () => {
  const router = useRouter();

  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "city", label: "Cidade", numeric: false },
    { id: "duration", label: "Duração", numeric: false },
    { id: "progress", label: "Progresso", numeric: false },
  ];

  const [loading, setLoading] = useState(true);
  const [evens, setEvents] = useState<any[]>([]);
  const [origin, setOrigin] = useState<any>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Eventos | Busca Ativa";
  }, []);

  interface Row {
    id: string;
    title: string;
    city: string;
    duration: string;
    progress: string;
    origin: string;
  }

  const [rows, setRows] = useState<Row[]>([]);
  const user: any = AuthService.getUser();

  useEffect(() => {
    // Obtém os dados da instituição
    const fetchInstitution = async () => {
      const res = await api.get(`coordinator/institution`);
      return res.data.data.institution;
    };

    // Obtém os eventos e formata os dados
    const fetchEvents = async () => {
      const res = await api.get(`coordinator/institution/events`);
      return res.data.data;
    };

    // Atualiza os estados com os dados formatados
    const loadData = async () => {
      setLoading(true);
      try {
        const [institution, eventsData] = await Promise.all([
          fetchInstitution(),
          fetchEvents(),
        ]);
        setOrigin(institution);

        const formattedEvents = eventsData.map((event: any) => ({
          id: event.id,
          name: event.name,
          city: "Fortaleza", // Pode ser atualizado para outro dado, se necessário
          duration: `${formatDate(event.date_start)} - ${formatDate(
            event.date_end
          )}`,
          progress: `${event.current_progress}/${event.meta}`,
          origin: institution,
        }));

        setEvents(formattedEvents);

        const formattedRows = formattedEvents.map((event: any) => {
          const [start] = event.duration.split(" - ");
          return {
            id: event.id,
            title: event.name,
            city: event.city,
            duration: event.duration,
            progress: event.progress,
            origin: event.origin,
            config: {
              analyseble: isPastEvent(start),
              editable: !isPastEvent(start),
              deletable: true,
            },
          };
        });

        setRows(formattedRows);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAnalyse = (row: Record<string, string | number>) => {
    console.log("Analyzing row:", row);
    router.push(`/coordinator/evento/${row.id}`);
  };

  const handleDelete = async (row: Record<string, string | number>) => {
    api.delete("coordinator/event", {
      data: { id_event: row.id },
      withCredentials: true,
    });
  };

  const handleEdit = (row: Record<string, string | number>) => {
    console.log("Editing row:", row);
  };

  const handleSubmitEvent = async (data: any) => {
    console.log("Submitting event:", data);
    try {
      const response = await api.post("/coordinator/event", data);

      if (response.status === 200) {
        setEvents((prevEvents) => [...prevEvents, response.data.data]);
      }
    } catch (error: any) {}

    setIsModalOpen(false);
  };

  return (
    <div className="w-[100%] px-[45px] py-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <PageTitle title="Eventos" />
        <button
          className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Add />
          <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
            Novo Evento
          </div>
        </button>
      </div>
      {loading && <SkeletonTable columns={columns} showActions />}
      {!loading && (
        <BATable
          columns={columns}
          initialRows={rows as any}
          onAnalyse={handleAnalyse}
          onDelete={handleDelete}
          onEdit={handleDelete}
        />
      )}
      {isModalOpen && (
        <NewEvent
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitEvent}
        />
      )}
    </div>
  );
};

export default Eventos;
