"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import BATable from "@/components/BATable";
import { toast } from "react-toastify";
import NewUnitModal from "@/components/Modals/NewUnit";
import "react-toastify/dist/ReactToastify.css";
import SkeletonTable from "@/components/SkeletonTable";
import PageTitle from "@/components/PageTitle";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const InstituicoesAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pass, setPass] = useState(false);
  const [rows, setData] = useState<Row[]>([]);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>({});

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => {
    setSelectedUnit({});
    setModalOpen(false);
  };

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  useEffect(() => {
    document.title = "Unidades | Busca Ativa";
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/coordinator/institution/units", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        console.log("dataFromApi", dataFromApi);
        const rows = dataFromApi.data.map((unit: any) => {
          return {
            ...unit,
            supervisor: unit.supervisor
              ? unit.supervisor.name
              : "Sem supervisor",
            active: unit.active ? "Sim" : "Não",
            config: { analyseble: false, editable: true, deletable: true },
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
    { id: "code", label: "Cód. Uni.", numeric: false },
    { id: "supervisor", label: "Supervisor", numeric: false },
  ];

  interface Row {
    id: number;
    name: string;
    code: string;
    estado: string;
    cidade: string;
    active: string;
    config: string;
    [key: string]: string | number;
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
      setData((prev: any) => [
        ...prev,
        {
          name: newInstitution.unitName,
          code: newInstitution.unitCode,
          id_supervisor: newInstitution.idSupervisor,
        },
      ]);
      toast.success("Unidade cadastrada com sucesso!");
      handleClose();
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
    } catch (error: any) {
      toast.error(error.response.data.message);
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
      const updatedFields: any = {};
      if (editedUnit.active !== selectedUnit.active)
        updatedFields.active = editedUnit.active;
      if (editedUnit.unitName !== selectedUnit.name)
        updatedFields.name = editedUnit.unitName;
      if (editedUnit.unitCode !== selectedUnit.code)
        updatedFields.code = editedUnit.unitCode;
      if (editedUnit.idSupervisor !== selectedUnit.id_supervisor)
        updatedFields.id_supervisor = editedUnit.idSupervisor;

      if (Object.keys(updatedFields).length > 0) {
        await api.patch(
          `/coordinator/unit`,
          {
            id_unit: selectedUnit.id, // Altere 'unit_id' para 'id'
            ...updatedFields,
          },
          { withCredentials: true }
        );

        const updatedData = rows.map((unit) => {
          if (unit.id === editedUnit.id) {
            return { ...unit, ...updatedFields };
          }
          return unit;
        });
        setData(updatedData);

        if (!selectedUnit.active && editedUnit.active) {
          await api.post(
            "coordinator/unit/active",
            { id_unit: selectedUnit.id, active: true },
            { withCredentials: true }
          );
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error updating unit:", error);
      // Exiba um erro para o usuário
    }
  };

  return (
    <>
      {pass && (
        <>
          <div className="w-[100%] px-[45px] py-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <PageTitle title="Unidades" />
              <Button
                onClick={handleOpen}
                sx={{
                  height: "41px",
                  px: 4,
                  py: 2,
                  backgroundColor: "#19b394",
                  "&:hover": {
                    backgroundColor: "var(--primary-dark)",
                  },
                  borderRadius: 1,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "white",
                  textTransform: "none",
                }}
              >
                <Add />
                <div
                  style={{
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    fontFamily: "'Source Sans Pro', sans-serif",
                    lineHeight: "18px",
                  }}
                >
                  Nova Unidade
                </div>
              </Button>
            </div>
            {loading && <SkeletonTable columns={columns} showActions={true} />}
            {!loading && (
              <BATable
                columns={columns}
                initialRows={rows}
                onDelete={onDelete}
                onEdit={handleEdit}
              />
            )}
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
      <ToastContainerWrapper />
    </>
  );
};

export default InstituicoesAdmin;
