"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BATable from "@/components/BATable";

import api from "@/services/api";

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
  const [unitInfo, setUnitInfo] = useState("Loading...");

  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "duration", label: "Duração", numeric: false },
    { id: "progress", label: "Progresso", numeric: false },
  ];

  interface Row {
    id: string;
    title: string;
    duration: string;
    progress: string;
  }

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/all/user", { withCredentials: true });
        const dataFromApi = response.data;
        const unit = dataFromApi.unit;
        setUnitInfo(unit.name);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api.get(`supervisor/events`);
      return res.data.data;
    };

    const loadData = async () => {
      try {
        const [eventsData] = await Promise.all([fetchEvents()]);

        const formattedEvents = eventsData.map((event: any) => ({
          id: event.id,
          name: event.name,
          duration: `${formatDate(event.date_start)} - ${formatDate(
            event.date_end
          )}`,
          progress: `${event.current_progress}/${event.meta}`,
        }));

        const formattedRows = formattedEvents.map((event: any) => {
          const [start] = event.duration.split(" - ");
          return {
            id: event.id,
            title: event.name,
            city: event.city,
            duration: event.duration,
            progress: event.progress,
            config: {
              analyseble: isPastEvent(start),
            },
          };
        });

        setRows(formattedRows);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    loadData();
  }, []);

  const handleAnalyse = (row: Record<string, string | number>) => {
    console.log("Analyzing row:", row);
    router.push(`/supervisor/eventos/${row.id}`);
  };

  return (
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h1>Times</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {unitInfo}
          </h2>
        </div>
      </div>
      <BATable
        columns={columns}
        initialRows={rows as any}
        onAnalyse={handleAnalyse}
      />
    </div>
  );
};

export default Eventos;
