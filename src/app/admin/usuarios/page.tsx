"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewCoordinatorModal from "@/components/Modals/NewCoordinator";
import SkeletonTable from "@/components/SkeletonTable";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const UsuariosAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [allRows, setAllRows] = useState<any[]>([]); // dados originais
  const [filteredRows, setFilteredRows] = useState<any[]>([]); // dados após filtro
  const [searchText, setSearchText] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

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

  const mapRole = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "superuser":
        return "Super Usuário";
      case "coordinator":
        return "Coordenador";
      case "supervisor":
        return "Supervisor";
      case "user":
        return "Usuário";
      case "agent":
        return "Agente";
      case "editor":
        return "Editor";
      default:
        return "Desconhecido";
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/admin/users", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const users = dataFromApi.data.map((user: any) => ({
          ...user,
          role: mapRole(user.role),
          institution: user.institution
            ? user.institution.name
            : "Sem Instituição",
          active: user.active ? "Ativo" : "Inativo",
        }));
        setAllRows(users);
        setFilteredRows(users); // inicia com tudo
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Aplica os filtros combinados sempre que algum filtro muda
  useEffect(() => {
    const lowerSearch = searchText.toLowerCase();

    const newFilteredRows = allRows.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.identificator?.toLowerCase().includes(lowerSearch);
      const matchesInstitution = selectedInstitution
        ? user.institution === selectedInstitution
        : true;
      const matchesRole = selectedRole ? user.role === selectedRole : true;

      return matchesSearch && matchesInstitution && matchesRole;
    });

    setFilteredRows(newFilteredRows);
  }, [searchText, selectedInstitution, selectedRole, allRows]);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "identificator", label: "Cód. Id.", numeric: false },
    { id: "institution", label: "Instituição", numeric: false },
    { id: "role", label: "Cargo", numeric: false },
    { id: "active", label: "Status", numeric: true },
  ];

  const onAdd = (newUser: any) => {
    const mappedUser = {
      ...newUser,
      role: mapRole(newUser.role),
      institution: newUser.institution
        ? newUser.institution.name
        : "Sem Instituição",
      active: newUser.active ? "Ativo" : "Inativo",
    };
    const updated = [...allRows, mappedUser];
    setAllRows(updated);
  };

  return (
    <>
      {pass && (
        <div className="w-full min-h-screen px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
          <div className="flex justify-between">
            <h1>Usuários</h1>
            <Button
              onClick={handleOpen}
              className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded text-white flex items-center gap-2"
            >
              <Add />
              <span className="text-sm font-semibold font-['Source Sans Pro']">
                Novo Usuário
              </span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Pesquisar por nome ou código"
              className="border rounded px-3 py-2 w-64"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <select
              className="border rounded px-3 py-2 w-56"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
            >
              <option value="">Todas Instituições</option>
              {Array.from(new Set(allRows.map((user) => user.institution)))
                .filter(Boolean)
                .map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
            </select>

            <select
              className="border rounded px-3 py-2 w-48"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Todos Cargos</option>
              {Array.from(new Set(allRows.map((user) => user.role)))
                .filter(Boolean)
                .map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
            </select>
          </div>

          {loading ? (
            <SkeletonTable columns={columns} />
          ) : (
            <BATable columns={columns} initialRows={filteredRows} />
          )}
        </div>
      )}

      <NewCoordinatorModal
        onSubmit={onAdd}
        open={isModalOpen}
        onClose={handleClose}
      />
      <ToastContainerWrapper />
    </>
  );
};

export default UsuariosAdmin;
