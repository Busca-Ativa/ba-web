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

interface Row {
  [key: string]: string | number;
}

const Times = () => {
  const [userRows, setUserRows] = useState<any[]>([]);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "identificator", label: "Cód. Id.", numeric: false },
    { id: "unit", label: "Unidade", numeric: false },
    { id: "role", label: "Cargo", numeric: false },
  ];

  const handleAddTeam = () => {
    console.log("Add team");
  };

  const handleEditTeam = () => {
    console.log("Edit team");
  };

  const handleDeleteTeam = () => {
    console.log("Delete team");
  };

  return (
    <>
      <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-1">
        <div className="flex justify-between">
          <h1>Times</h1>
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
        <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
          {"Teste"}
        </h2>
        <BATable
          columns={columns}
          initialRows={userRows}
          onEdit={handleEditTeam}
          onDelete={handleDeleteTeam}
        />
      </div>

      <ToastContainer />
    </>
  );
};

export default Times;
