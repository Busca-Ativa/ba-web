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
import { active } from "d3";
import NewTeamModal from "@/components/Modals/NewTeam";
import "react-toastify/dist/ReactToastify.css";
import SkeletonTable from "@/components/SkeletonTable";
import PageTitle from "@/components/PageTitle";

interface Row {
  [key: string]: string | number;
}

const Times = () => {
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "unitName", label: "Unidade", numeric: false },
    { id: "agents", label: "Agentes", numeric: false },
  ];

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/coordinator/institution/teams", {
          withCredentials: true,
        });

        const dataFromApi = response.data;

        const rows = await Promise.all(
          dataFromApi.data.map(async (team: any) => {
            try {
              // Requisição para buscar a unidade
              const unitResponse = await api.get(
                `/coordinator/institution/unit/${team.id_unit}`,
                { withCredentials: true }
              );
              const unitName = unitResponse.data.data.name;

              return {
                ...team,
                agents:
                  team.agents.length > 0
                    ? team.agents.map((agent: any) => agent.name).join(", ")
                    : "sem agentes",
                unitName,
                active: team.active ? "Sim" : "Não",
                config: {
                  analyseble: false,
                  editable: false,
                  deletable: true,
                },
              };
            } catch (unitError) {
              console.error(
                `Erro ao buscar unidade para o time ${team.name}:`,
                unitError
              );
              return null;
            }
          })
        );

        setRow(rows);
      } catch (error) {
        console.error("Erro ao buscar times:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleAddTeam = async (team: any) => {
    try {
      const response = await api.post(
        "/coordinator/team",
        {
          id_unit: team.id_unit,
          team_name: team.name,
          users: team.agents,
        },
        {
          withCredentials: true,
        }
      );

      if (
        response.data.message === "Time criado com usuários" ||
        response.data.message === "Time sem usuários criado com sucesso"
      ) {
        toast.success(response.data.message);
        setRow((prevRows) => [...prevRows, response.data.data]);
        setModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar time:", error);
      toast.error("Erro ao adicionar time.");
    }
  };

  const handleEditTeam = () => {
    console.log("Edit team");
  };

  const handleDeleteTeam = async (row: any) => {
    try {
      const response = await api.post(
        "coordinator/team/active",
        { id_team: row.id, active: false },
        { withCredentials: true }
      );
      toast.success("Time deletado com sucesso.");
      setRow((prevRows) => prevRows.filter((team) => team.id !== row.id));
    } catch (error) {
      toast.error("Erro ao deletar time.");
    }
  };

  return (
    <>
      <div className="w-[100%] px-[45px] py-[60px] flex flex-col gap-8 2xl:gap-10">
        <div className="flex justify-between">
          <PageTitle title="Times" />
          <Button
            onClick={() => setModalOpen(true)}
            className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
          >
            <Add />
            <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
              Adicionar Time
            </div>
          </Button>
        </div>
        {loading && (
          <SkeletonTable
            columns={columns}
            showActions={true}
            showEdit={false}
          />
        )}
        {!loading && (
          <BATable
            columns={columns}
            initialRows={row}
            onEdit={handleEditTeam}
            onDelete={handleDeleteTeam}
          />
        )}
      </div>
      <NewTeamModal
        onClose={() => {
          setModalOpen(false);
          setSelectedTeam({});
        }}
        onSubmit={isEdit ? handleEditTeam : handleAddTeam}
        open={modalOpen}
        data={selectedTeam}
        edit={isEdit}
      />
      <ToastContainer />
    </>
  );
};

export default Times;
