"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { act, useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { ToastContainer } from "react-toastify";
import NewUnitModal from "@/components/Modals/NewUnit";
import { on } from "events";

const InstituicoesAdmin = () => {
  const router = useRouter();
  const [pass, setPass] = useState(false);
  const [rows, setData] = useState<Row[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>({});

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
            active: unit.active ? "Sim" : "Não",
            estado: getEstadoById(unit.institution.code_state),
            cidade: getCidadeById(
              unit.institution.code_state,
              unit.institution.code_city
            ),
            config: { analyseble: false, editable: true, deletable: true },
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
    { id: "active", label: "Ativo", numeric: false },
  ];

  interface Row {
    id: number;
    name: string;
    code: string;
    estado: string;
    cidade: string;
    active: boolean;
    config: { editable: boolean; deletable: boolean; analyseble: boolean };
  }

  const onAdd = (newInstitution: any) => {
    try {
      api.post(
        "/coordinator/unit",
        {
          name: newInstitution.unitName,
          code: newInstitution.unitCode,
          id_supervisor: newInstitution.idSupervisor,
        },
        {
          withCredentials: true,
        }
      );
      setData((prev) => [
        ...prev,
        {
          name: newInstitution.unitName,
          code: newInstitution.unitCode,
          id_supervisor: newInstitution.idSupervisor,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const onDelete = async (row: Record<string, string | number>) => {
    try {
      await api.delete(`/coordinator/unit`, {
        data: { id_unit: row.id },
        withCredentials: true,
      });
      setData((prev) => prev.filter((unit) => unit.id !== row.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (row: Record<string, string | number>) => {
    api
      .get(`/coordinator/institution/unit/${row.id}`, { withCredentials: true })
      .then((response) => {
        setSelectedUnit(response.data.data);
        setEditModalOpen(true);
        setModalOpen(true);
      });
  };

  const onEdit = async (editedUnit: any) => {
    try {
      await api.patch(
        `/coordinator/unit`,
        {
          active: editedUnit.active,
          name: editedUnit.unitName,
          code: editedUnit.unitCode,
          id_supervisor: editedUnit.idSupervisor,
          unit_id: selectedUnit.id,
        },
        { withCredentials: true }
      );
      const updatedData = rows.map((unit) => {
        if (unit.id === editedUnit.id) {
          return editedUnit;
        }
        return unit;
      });
      setData(updatedData);
    } catch (error) {
      console.log(error);
    }
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
            <BATable
              columns={columns}
              initialRows={rows}
              onDelete={onDelete}
              onEdit={handleEdit}
            />
          </div>
        </>
      )}
      <NewUnitModal
        onSubmit={isEditModalOpen ? onEdit : onAdd}
        open={isModalOpen}
        onClose={handleClose}
        edit={isEditModalOpen}
        data={selectedUnit}
      />
      <ToastContainer />
    </>
  );
};

export default InstituicoesAdmin;
