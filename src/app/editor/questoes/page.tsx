"use client";

import BATable from "@/components/BATable";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";

import ModalQuestions from "@/components/FormCreator/ModalQuestions";
import ConfirmAction from "@/components/Modals/ConfirmAction";
import PageTitle from "@/components/PageTitle";
import SkeletonTable from "@/components/SkeletonTable";
import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";
import { AuthService } from "@/services/auth/auth";
import { getStatus, StatusObject } from "@/utils";
import { useDispatch } from "react-redux";
import { addElement, removeAllElements } from "../../../../redux/surveySlice";
import api from "../../../services/api";

const Questoes = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "type", label: "Tipo", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
  ];

  const [forms, setForms] = useState<any[]>([]);
  interface Row {
    id: any;
    title: any;
    creator: string;
    status: string;
    config: { editable: boolean; deletable: boolean };
    origin: any;
  }
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedRow, setSelectedRow] = useState<Record<
    string,
    string | number
  > | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>({});
  const user: any = AuthService.getUser();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!modalOpen) {
      dispatch(removeAllElements({ pageIndex: 0 }));
      setModalEdit(false);
    }
  }, [dispatch, modalOpen]);

  useEffect(() => {
    const getForms = async () => {
      setLoading(true);
      let list_forms: SetStateAction<any[]> = [];
      try {
        let response = await api.get("/editor/questions", {
          withCredentials: true,
        });
        if (response.data) {
          list_forms.push(...response.data);
        }
      } catch (error: any) {
        console.error(error.response?.message);
        throw error;
      } finally {
        setForms(list_forms);
        setLoading(false);
      }
    };
    getForms();
  }, []);

  useEffect(() => {
    document.title = "Questões | Busca Ativa";
  }, []);

  const reloadQuestions = () => {
    const getForms = async () => {
      setLoading(true);
      let list_forms: SetStateAction<any[]> = [];
      try {
        let response = await api.get("/editor/questions", {
          withCredentials: true,
        });
        if (response.data) {
          list_forms.push(...response.data);
        }
      } catch (error: any) {
        console.error(error.response?.message);
        throw error;
      } finally {
        setForms(list_forms);
        setLoading(false);
      }
    };
    getForms();
  };

  const getType = (type: string) => {
    if (type == "text") return "Resposta Curta";
    if (type == "comment") return "Resposta Longa";
    if (type == "boolean") return "Sim/Não";
    if (type == "radiogroup") return "Seleção Única";
    if (type == "checkbox") return "Seleção Multipla";
  };
  // TODO: Quando deletar apagar a linha da tabela e refresh do component
  useEffect(() => {
    setRows(
      forms?.map((value: any) => {
        const name: string = value.creator.name + " " + value.creator.lastName;
        const status: StatusObject = getStatus(value.tags[1]);
        return {
          id: value.id,
          title: value.title || value.question_data.name,
          creator: name,
          status: status.name,
          type: getType(value.type),
          config:
            value.creator.id !== user.id
              ? { editable: false, deletable: false, duplicable: true }
              : { editable: true, deletable: true, duplicable: false },
          origin: value.origin ? value.origin.name : value.unit.name,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

  const pushEditor = () => {
    setModalOpen(true);
  };

  const deleteQuestion = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    try {
      let response = await api.delete(`/editor/question/${row.id}`, {
        withCredentials: true,
      });
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
      setConfirmDelete(false);
      setSelectedRow(null);
      setSelectedRowIndex(null);
      toast.success("Questão deletada com sucesso!");
    } catch (error: any) {
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
    setEditQuestion(row);
    api
      .get(`/editor/question/${row.id}`, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          dispatch(removeAllElements({ pageIndex: 0 }));
          dispatch(addElement({ pageIndex: 0, element: data.question_data }));
          setModalOpen(true);
          setModalEdit(true);
        }
      });
  };

  const handleDuplicate = async (row: any, rowIndex: number) => {
    try {
      let response = await api.post(
        `/editor/question/${row.id}`,
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
          config:
            data.editor.id !== user.id
              ? { editable: false, deletable: false }
              : status.config,
          origin:
            data.tags[0] === "institution"
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
        <PageTitle title="Questões" />
        <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
          <Add />
          <div
            className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
            onClick={pushEditor}
          >
            Nova Questão
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
      {modalOpen && (
        <ModalQuestions
          onClose={setModalOpen}
          modalEdit={modalEdit}
          setModalEdit={setModalEdit}
          editQuestion={editQuestion}
          reloadQuestions={reloadQuestions}
        />
      )}
      <ConfirmAction
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          if (selectedRow && selectedRowIndex !== null) {
            deleteQuestion(selectedRow, selectedRowIndex);
          }
        }}
        actionLabel="Deletar Seção"
        description="Você tem certeza que deseja deletar esta seção?"
      />
      <ToastContainerWrapper />
    </div>
  );
};

export default Questoes;
