"use client";

import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

import api from "../../../services/api";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { AuthService } from "@/services/auth/auth";
import { getStatus, StatusObject } from "@/utils";

const Eventos = () => {
  const router = useRouter();

  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "city", label: "Cidade", numeric: false },
    { id: "duration", label: "Duração", numeric: false },
    { id: "progress", label: "Progresso", numeric: false },
  ];

  const [evens, setEvents] = useState<any[]>([]);

  interface Row {
    title: string;
    city: string;
    duration: string;
    progress: string;
    origin: string;
  }

  const [rows, setRows] = useState<Row[]>([]);
  const user: any = AuthService.getUser();

  useEffect(() => {
    api.get(`coordinator/institution/events`).then((res) => {
      const data = res.data;

      // Função para formatar a data no padrão dd/mm/aa
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
      };

      // Mapeando os dados recebidos da API para o formato do estado `events`
      const formattedEvents = data.data.map((event: any) => ({
        id: event.id,
        name: event.name,
        city: "Fortaleza", // Supondo que `city` esteja relacionado a `meta_description`
        duration: `${formatDate(event.date_start)} - ${formatDate(
          event.date_end
        )}`, // Calculando a duração
        progress: `${event.current_progress}/${event.meta}`, // Formatação de progresso
        origin: event.description, // Adicionando o campo `origin`
      }));

      // Atualizando o estado `events` com os dados formatados
      setEvents(formattedEvents);

      // Atualizando o estado `rows` com base nos dados formatados para tabelas
      const formattedRows = formattedEvents.map((event: any) => ({
        title: event.name,
        city: event.city,
        duration: event.duration,
        progress: event.progress,
        origin: event.origin,
        config: {
          analyseble: true,
          editable: true,
          deletable: true,
        },
      }));

      setRows(formattedRows);
    });
  }, []);

  return (
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px]">
          <h1>Eventos</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {/* Secretaria de Saúde - Fortaleza */}
            {(evens[0] as any)?.origin?.name} -{" "}
            {(evens[0] as any)?.origin?.institution?.code_state} -{" "}
            {(evens[0] as any)?.origin?.institution?.code_city}
          </h2>
        </div>
        <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
          <Add />
          <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
            Novo Evento
          </div>
        </button>
      </div>
      <BATable columns={columns} initialRows={rows as any} />
    </div>
  );
};

export default Eventos;
