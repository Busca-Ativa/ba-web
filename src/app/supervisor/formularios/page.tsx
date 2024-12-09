"use client";
import "survey-core/defaultV2.min.css";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import BATable from "@/components/BATable";

import api from "@/services/api";
import { getStatus, StatusObject } from "@/utils";
import { Model, Survey } from "survey-react-ui";

const Formularios = () => {
  const router = useRouter();
  const [unitInfo, setUnitInfo] = useState("Loading...");
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "status", label: "Status", numeric: false },
  ];

  const [forms, setForms] = useState<any[]>([]);
  interface Row {
    id: any;
    title: any;
    creator: string;
    status: string;
    config: { analyseble: boolean };
  }

  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<any>();

  useEffect(() => {
    const getForms = async () => {
      let list_forms = [];
      try {
        let response = await api.get("/supervisor/unit/forms", {
          withCredentials: true,
        });
        if (response.data.data) {
          console.log(response.data.data);
          list_forms.push(...response.data.data);
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
          config: { analyseble: true },
        };
      })
    );
  }, [forms]);

  const pushEditor = () => {
    router.push("/editor");
  };

  const handleSee = (row: Record<string, string | number>) => {
    fetchFormById(row.id);
  };

  const fetchFormById = async (id: any) => {
    try {
      const response = await api.get(`/supervisor/unit/form/${id}`, {
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

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/all/user", { withCredentials: true });
        const dataFromApi = response.data;
        const unit = dataFromApi.unit;
        setUnitInfo(unit.name);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col">
      <div className="flex justify-between mb-7 items-center">
        <div className="flex flex-col gap-1">
          <h1>Formulários</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {unitInfo}
          </h2>
        </div>
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
