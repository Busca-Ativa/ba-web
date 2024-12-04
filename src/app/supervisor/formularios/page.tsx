"use client";
import "survey-core/defaultV2.min.css";

import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { Add, Close, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

import api from "../../../services/api";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { AuthService } from "@/services/auth/auth";
import { getStatus, StatusObject } from "@/utils";
import { Model, Survey } from "survey-react-ui";

const Formularios = () => {
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
  ];

  const [forms, setForms] = useState<any[]>([]);
  interface Row {
    id: any;
    title: any;
    creator: string;
    status: string;
    config: { analyseble: boolean };
    origin: any;
  }

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<any>();

  // useEffect(() => {
  //   const getForms = async () => {
  //     let list_forms = [];
  //     try {
  //       let response = await api.get("/coordinator/institution/forms", {
  //         withCredentials: true,
  //       });
  //       if (response.data.data) {
  //         console.log(response.data.data);
  //         list_forms.push(...response.data.data);
  //       }

  //       // WARN: Pegar unidades pega alguns forms que ja vem no da instituição fazendo eles ficarem repetidos
  //       // response = await api.get('/editor/unit/forms')
  //       // if (response.data.data){
  //       //   list_forms.push(...response.data.data)
  //       // }
  //     } catch (error: any) {
  //       console.error(error.response?.message);
  //       throw error;
  //     } finally {
  //       setForms(list_forms);
  //     }
  //   };
  //   getForms();
  // }, []);

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
          // WARN: Apenas se for o mesmo criado pode deletar e editar.
          config: { analyseble: true },
          origin: value?.origin?.name,
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

  const pushEditor = () => {
    router.push("/editor");
  };

  const handleSee = (row: Record<string, string | number>) => {
    fetchFormById(row.id);
  };

  const fetchFormById = async (id: any) => {
    try {
      const response = await api.get(`/coordinator/institution/form/${id}`, {
        withCredentials: true,
      });
      if (response.data) {
        setForm(response.data);
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
          <h1>Formulários</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {/* Secretaria de Saúde - Fortaleza */}
            {(forms[0] as any)?.origin?.name} -{" "}
            {(forms[0] as any)?.origin?.institution?.code_state} -{" "}
            {(forms[0] as any)?.origin?.institution?.code_city}
          </h2>
        </div>
        {/* <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
          <Add />
          <div
            className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
            onClick={pushEditor}
          >
            Novo Formulário
          </div>
        </button> */}
      </div>
      <BATable
        columns={columns}
        initialRows={rows as any}
        onAnalyse={handleSee}
      />
      {form && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 pb-16 rounded shadow-lg w-[80%] max-w-[800px] h-[80%]">
            <div className="flex justify-end items-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setForm(null)}
              >
                <Close />
              </button>
            </div>
            <Survey model={new Model(form?.data?.survey_schema)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Formularios;
