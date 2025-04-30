"use client";

import BATable from "@/components/BATable";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

import PageTitle from "@/components/PageTitle";
import SkeletonTable from "@/components/SkeletonTable";
import { AuthService } from "@/services/auth/auth";
import { getStatus, StatusObject } from "@/utils";
import api from "../../../services/api";
import ConfirmAction from "@/components/Modals/ConfirmAction";
import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const Formularios = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
    { id: "tags", label: "Categorias", numeric: false },
  ];

  const [forms, setForms] = useState<any[]>([]);
  interface Row {
    id: any;
    title: any;
    creator: string;
    status: string;
    tags?: any;
    config: { editable: boolean; deletable: boolean; duplicable: boolean };
    origin: any;
  }

  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState<Record<
    string,
    string | number
  > | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const user: any = AuthService.getUser();

  useEffect(() => {
    document.title = "Formulários | Busca Ativa";
  }, []);

  useEffect(() => {
    const getForms = async () => {
      setLoading(true);
      let list_forms = [];
      try {
        let response = await api.get("/editor/institution/forms", {
          withCredentials: true,
        });
        if (response.data.data) {
          list_forms.push(...response.data.data);
        }
        response = await api.get("/editor/unit/forms");
        if (response.data.data) {
          list_forms.push(...response.data.data);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn("Nenhum formulário encontrado");
        } else {
          console.error(error.response?.message);
        }
      } finally {
        setForms(list_forms);
        setLoading(false);
      }
    };
    getForms();
  }, []);

  // TODO: Quando deletar apagar a linha da tabela e refresh do component
  useEffect(() => {
    return setRows(
      forms?.map((value: any) => {
        const name: string = value.editor.name + " " + value.editor.lastName;
        const status: StatusObject = getStatus(value?.status) as StatusObject;
        return {
          id: value.id,
          title: value.name,
          creator: name,
          status: status.name,
          tags:
            value.survey_schema.tags.slice(0, 3).join(", ") +
            (value.survey_schema.tags.length > 3 ? ", [...]" : ""),
          // WARN: Apenas se for o mesmo criado pode deletar e editar.
          config:
            value.editor.id !== user.id
              ? { editable: false, deletable: false, duplicable: true }
              : { editable: true, deletable: true, duplicable: false },
          origin: value?.origin?.name,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

  const pushEditor = () => {
    router.push("/editor");
  };

  const deleteForm = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    try {
      let response = await api.delete(`/editor/form/${row.id}`, {
        withCredentials: true,
      });
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
      setConfirmDelete(false);
      setSelectedRow(null);
      setSelectedRowIndex(null);
      toast.success("Formulário deletado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao deletar o formulário!");
      console.error(error.response?.message);
      throw error;
    }
  };

  const handleDelete = (
    row: SetStateAction<Record<string, string | number> | null>,
    rowIndex: number
  ) => {
    setSelectedRow(row);
    setSelectedRowIndex(rowIndex);
    setConfirmDelete(true);
  };

  const handleEdit = async (row: Record<string, string | number>) => {
    router.push(`/editor/?id=${row.id}`);
  };

  const handleDuplicate = async (row: any, rowIndex: number) => {
    try {
      let response = await api.post(
        `/editor/form/${row.id}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const data = response.data.data;
        const status = getStatus(data.tags[1]) as StatusObject;
        const duplicatedRow = {
          id: data.id,
          title: data.name,
          creator: data.editor.name + " " + data.editor.lastName,
          status: status.name,
          config:
            data.editor.id !== user.id
              ? { editable: false, deletable: false, duplicable: true }
              : { editable: true, deletable: true, duplicable: false },
          origin:
            data?.tags[0] === "institution"
              ? data.institution.name
              : data.unit.name,
        };
        const updatedRows = [
          ...rows.slice(0, rowIndex + 1),
          duplicatedRow,
          ...rows.slice(rowIndex + 1),
        ];
        setRows(updatedRows);
      }
    } catch (error: any) {
      console.error(error.response?.message);
      throw error;
    }
  };

  return (
    <div className="w-[100%] px-[45px] py-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <PageTitle title="Formulários" />
        <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
          <Add />
          <div
            className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
            onClick={pushEditor}
          >
            Novo Formulário
          </div>
        </button>
      </div>
      {loading && <SkeletonTable columns={columns} showActions={true} />}
      {!loading && (
        <BATable
          columns={columns}
          initialRows={rows as any}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      <ConfirmAction
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (selectedRow && selectedRowIndex !== null) {
            deleteForm(selectedRow, selectedRowIndex);
          }
        }}
        actionLabel="Deletar Formulário"
        description="Você tem certeza que deseja deletar este formulário?"
      />
      <ToastContainerWrapper />
    </div>
  );
};

export default Formularios;
