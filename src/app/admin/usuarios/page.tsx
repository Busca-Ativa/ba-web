"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button, Skeleton } from "@mui/material";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewCoordinatorModal from "@/components/Modals/NewCoordinator";
import { ToastContainer } from "react-toastify";
import SkeletonTable from "@/components/SkeletonTable";

const UsuariosAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [rows, setData] = useState<any[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    document.title = "Usuários | Busca Ativa";
  }, []);

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
      setLoading(true);
      try {
        const response = await api.get("/admin/users", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((user: any) => {
          console.log(user);
          return {
            ...user,
            institution: user.institution
              ? user.institution.name
              : "Sem Instituição",
            active: user.active ? "Ativo" : "Inativo",
          };
        });
        setData(rows);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
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
    setData((prev: any) => [...prev, newInstitution]);
  };

  return (
    <>
      {pass && (
        <>
          <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Usuários</h1>
              <Button
                onClick={handleOpen}
                className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
              >
                <Add />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Novo Usuário
                </div>
              </Button>
            </div>
            {loading && <SkeletonTable columns={columns} />}
            {!loading && <BATable columns={columns} initialRows={rows} />}
          </div>
        </>
      )}
      <NewCoordinatorModal
        onSubmit={onAdd}
        open={isModalOpen}
        onClose={handleClose}
      />
      <ToastContainer />
    </>
  );
};

export default UsuariosAdmin;
