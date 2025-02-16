"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add, HowToReg } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { toast, ToastContainer } from "react-toastify";
import { translateRole } from "@/utils/index";
import CoordinatorEditUser from "@/components/Modals/CoordinatorEditUser";
import PageTitle from "@/components/PageTitle";

interface Row {
  [key: string]: string | number;
}

const Times = () => {
  const [userRows, setUserRows] = useState<any[]>([]);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "created_at", label: "Data de Criação", numeric: false },
    { id: "agents", label: "Quant. Agentes", numeric: true },
  ];

  const handleAddTeam = () => {
    console.log("Add team");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/supervisor/unit/teams", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((user: any) => {
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          }).format(new Date(user.created_at));

          return {
            name: user.name,
            created_at: formattedDate,
            agents: user.agents.length,
          };
        });
        setUserRows(rows);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-1">
        <div className="flex justify-between mb-7 items-center">
          <PageTitle title="Times" />
          <Button
            onClick={handleAddTeam}
            className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
          >
            <Add />
            <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
              Adicionar Time
            </div>
          </Button>
        </div>
        <BATable columns={columns} initialRows={userRows} />
      </div>

      <ToastContainer />
    </>
  );
};

export default Times;
