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
import ModalQuestions from "@/components/FormCreator/ModalQuestions";

const Questoes = () => {
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
  const [rowsConfig, setRowsConfig] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const user: any = AuthService.getUser();

  useEffect(() => {
    const getForms = async () => {
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
      }
    };
    getForms();
  }, []);

  const getType = (type : string) => {
    if (type == "text") return "Resposta Curta";
    if (type == "comment") return "Resposta Longa";
    if (type == "boolean") return "Sim/Não";
    if (type == "radiogroup") return "Seleção Única";
    if (type == "chekbox") return "Seleção Multipla";
  };
  // TODO: Quando deletar apagar a linha da tabela e refresh do component
  useEffect(() => {
    setRows(
      forms?.map((value: any) => {
        const name: string = value.creator.name + " " + value.creator.lastName;
        const status: StatusObject = getStatus(value.tags[1]);
        return {
          id: value.id,
          title: value.title,
          creator: name,
          status: status.name,
          type: getType(value.type),
          config:
            value.creator.id !== user.id
              ? { editable: false, deletable: false }
              : { editable: true, deletable: true, duplicable: true },
          origin: "",
        };
      })
    );
  }, [forms]);

  const pushEditor = () => {
    setModalOpen(true);
  };

  const handleDelete = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    try {
      let response = await api.delete(`/editor/question/${row.id}`);
      const updatedRows = rows.filter((_, index) => index !== rowIndex);
      setRows(updatedRows);
    } catch (error: any) {
      console.error(error.response?.message);
      throw error;
    }
  };

  const handleEdit = async (row: Record<string, string | number>) => {
    router.push(`/editor/?id=${row.id}&type=question`);
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
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px]">
          <h1>Questões</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {/* Secretaria de Saúde - Fortaleza */}
            {/* {forms[0]?.institution.name} - {forms[0]?.institution.code_state} -{" "} */}
            {/* {forms[0]?.institution.code_city} */}
          </h2>
        </div>
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
      <BATable
        columns={columns}
        initialRows={rows as any}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      {modalOpen && <ModalQuestions onClose={setModalOpen} />}
    </div>
  );
};

export default Questoes;
