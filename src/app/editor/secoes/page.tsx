"use client";

import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

import api from "../../../services/api";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { AuthService } from "@/services/auth/auth";
import { getStatus, StatusObject } from "@/utils";
import PageTitle from "@/components/PageTitle";
import SkeletonTable from "@/components/SkeletonTable";
import ConfirmAction from "@/components/Modals/ConfirmAction";
import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const Secoes = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
  ];

  const [forms, setForms] = useState<any[]>([]);
  interface Row {
    id: any;
    title: string;
    creator: string;
    config: {
      editable: boolean;
      deletable: boolean;
      duplicable: boolean;
    };
    origin: string;
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
    document.title = "Seções | Busca Ativa";
  }, []);

  useEffect(() => {
    const getForms = async () => {
      setLoading(true);
      let list_forms = [];
      try {
        let response = await api.get("/editor/sections", {
          withCredentials: true,
        });
        if (response.data) {
          list_forms.push(...response.data);
        }

        // WARN: Pegar unidades pega alguns forms que ja vem no da instituição fazendo eles ficarem repetidos
        // response = await api.get('/editor/unit/forms')
        // if (response.data.data){
        //   list_forms.push(...response.data.data)
        // }
      } catch (error: any) {
        if (error.response?.status === 401) {
          console.warn("Unauthorized access - no forms available");
        } else {
          console.error(error.response?.message);
          throw error;
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
      forms?.map((value) => {
        const name: string = value.creator.name + " " + value.creator.lastName;
        return {
          id: value.id,
          title: value.title,
          creator: name,
          config:
            value.creator.id == user.id
              ? { editable: true, deletable: true, duplicable: false }
              : { editable: false, deletable: false, duplicable: true },
          origin: value.origin ? value?.origin?.name : value?.unit?.name,
        };
      })
    );
  }, [forms, user.id]);

  const pushEditor = () => {
    router.push("/editor?type=section");
  };

  const deleteSection = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    try {
      let response = await api.delete(`/editor/section/${row.id}`);
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
      setConfirmDelete(false);
      setSelectedRow(null);
      setSelectedRowIndex(null);
      toast.success("Seção deletada com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao deletar seção!");
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
    router.push(`/editor/?id=${row.id}&type=section`);
  };

  const handleDuplicate = async (row: any, rowIndex: number) => {
    try {
      let response = await api.post(
        `/editor/section/${row.id}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const data = response.data.data;
        const status = getStatus(data.tags[1]);
        const duplicatedRow = {
          id: data.id,
          title: data.name,
          creator: data.editor.name + " " + data.editor.lastName,
          status: status.name,
          config: {
            editable:
              data.creator.id !== user.id ? false : status.config.editable,
            deletable:
              data.creator.id !== user.id ? false : status.config.deletable,
            duplicable: false,
          },
          origin:
            data.tags[0] === "institution"
              ? data.institution?.name
              : data.unit?.name,
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
        <PageTitle title="Seções" />
        <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
          <Add />
          <div
            className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
            onClick={pushEditor}
          >
            Nova Seção
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
            deleteSection(selectedRow, selectedRowIndex);
          }
        }}
        actionLabel="Deletar Seção"
        description="Você tem certeza que deseja deletar esta seção?"
      />
      <ToastContainerWrapper />
    </div>
  );
};

export default Secoes;
