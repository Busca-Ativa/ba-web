"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { HowToReg } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { ToastContainer } from "react-toastify";

const UsuariosAdmin = () => {
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
        const response = await api.get('/admin/users', {withCredentials: true})
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map( (user: any) => {
          console.log(user)
          return {
            ...user,
            institution: user.institution? user.institution.name : "Sem Instituição",
            active: user.active? "Ativo" : "Inativo"
          }
        } )
        setData(rows);
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);


  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "identificator", label: "Cód. Id.", numeric: false },
    { id: "institution", label: "Instituição", numeric: false },
    { id: "role", label: "Cargo", numeric: false },
    { id: "active", label: "Status", numeric: true },
  ];

  const onAdd = (newInstitution: any) => {
    setData( ( prev: any ) => [ ...prev, newInstitution ] )
  }


  return (
    <>
      {pass && (
        <>
          <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Usuários</h1>
              <Button onClick={handleOpen} className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
                <HowToReg/>
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Aprovar Usuário
                </div>
              </Button>
            </div>
            <BATable columns={columns} initialRows={rows} />
          </div>
        </>
      )}
      <ToastContainer/>
    </>
  );
};

export default UsuariosAdmin;