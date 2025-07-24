"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import SkeletonTable from "@/components/SkeletonTable";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const InstituicoesAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState(false);
  const [allRows, setAllRows] = useState<any[]>([]);
  const [filteredRows, setFilteredRows] = useState<any[]>([]);

  const [searchText, setSearchText] = useState("");
  const [selectedUF, setSelectedUF] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    document.title = "Instituições | Busca Ativa";
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
        const response = await api.get("/admin/institutions", {
          withCredentials: true,
        });

        const rows = response.data.data.map((inst: any) => ({
          ...inst,
          estado: getEstadoById(inst.code_state),
          cidade: getCidadeById(inst.code_city),
        }));

        setAllRows(rows);
        setFilteredRows(rows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const searchLower = searchText.toLowerCase();

    const newFiltered = allRows.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchLower) ||
        inst.code.toLowerCase().includes(searchLower);

      const matchesUF = selectedUF ? inst.estado === selectedUF : true;
      const matchesCity = selectedCity ? inst.cidade === selectedCity : true;

      return matchesSearch && matchesUF && matchesCity;
    });

    setFilteredRows(newFiltered);
  }, [searchText, selectedUF, selectedCity, allRows]);

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "code", label: "Cód. Inst.", numeric: false },
    { id: "estado", label: "UF", numeric: false },
    { id: "cidade", label: "Cidade", numeric: false },
  ];

  const onAdd = (newInstitution: any) => {
    const processed = {
      ...newInstitution,
      estado: getEstadoById(newInstitution.code_state),
      cidade: getCidadeById(newInstitution.code_city),
    };

    const updated = [...allRows, processed];
    setAllRows(updated);
  };

  return (
    <>
      {pass && (
        <div className="w-full min-h-screen px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
          <div className="flex justify-between">
            <h1>Instituições</h1>
            <Button
              onClick={handleOpen}
              className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded text-white flex items-center gap-2"
            >
              <Add />
              <span className="text-sm font-semibold font-['Source Sans Pro']">
                Nova Instituição
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
              value={selectedUF}
              onChange={(e) => setSelectedUF(e.target.value)}
            >
              <option value="">Todas UFs</option>
              {Array.from(new Set(allRows.map((inst) => inst.estado)))
                .filter(Boolean)
                .sort()
                .map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
            </select>

            <select
              className="border rounded px-3 py-2 w-56"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Todas Cidades</option>
              {Array.from(new Set(allRows.map((inst) => inst.cidade)))
                .filter(Boolean)
                .sort()
                .map((city) => (
                  <option key={city} value={city}>
                    {city}
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

      <NewInstitutionModal
        onSubmit={onAdd}
        open={isModalOpen}
        onClose={handleClose}
      />
      <ToastContainerWrapper />
    </>
  );
};

export default InstituicoesAdmin;
