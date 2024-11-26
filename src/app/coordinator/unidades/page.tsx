"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { ToastContainer } from "react-toastify";
import NewUnitModal from "@/components/Modals/NewUnit";

const InstituicoesAdmin = () => {
  const router = useRouter();
  const [pass, setPass] = useState(false);
  const [rows, setData] = useState<any[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/coordinator/institution/units", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((unit: any) => {
          return {
            ...unit,
            estado: getEstadoById(unit.institution.code_state),
            cidade: getCidadeById(
              unit.institution.code_state,
              unit.institution.code_city
            ),
          };
        });
        setData(rows);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "code", label: "Cód. Uni.", numeric: false },
    { id: "estado", label: "UF", numeric: false },
    { id: "cidade", label: "Cidade", numeric: false },
  ];

  const onAdd = (newInstitution: any) => {
    setData((prev) => [...prev, newInstitution]);
  };

  return (
    <>
      {pass && (
        <>
          <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Unidades</h1>
              <Button
                onClick={handleOpen}
                className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
              >
                <Add />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Nova Unidade
                </div>
              </Button>
            </div>
            <BATable columns={columns} initialRows={rows} />
          </div>
        </>
      )}
      <NewUnitModal onSubmit={onAdd} open={isModalOpen} onClose={handleClose} />
      <ToastContainer />
    </>
  );
};

export default InstituicoesAdmin;
