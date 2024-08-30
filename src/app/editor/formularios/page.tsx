"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

import api from '../../../services/api'
import nookies from 'nookies';
import { GetServerSidePropsContext } from 'next';

const Formularios = () => {
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
  ];

  const [forms, setForms] = useState([]);

  useEffect( () =>{
    const getForms = async () =>{
      let list_forms = []
      try{

        let response = await api.get('/editor/institution/forms')
        if (response.data.data){
          list_forms.push(...response.data.data)
        }

        response = await api.get('/editor/unit/forms')
        if (response.data.data){
          list_forms.push(...response.data.data)
        }
      } catch (error: any){
        console.error(error.response?.message)
        throw error;
      } finally{
        setForms(list_forms)
      }

    }
    getForms()

  }, [] )


  const rows = forms?.map( (value) => {
    return {
      id: value.id,
      title: value.name,
      creator: value.editor.name + " " + value.editor.lastName,
      status: value.tags[0],
      origin: value.institution.name
    }
  } )


  const configRows = [
    {
      editable: true,
      deletable: true,
    },
    {
      editable: false,
    },
    {
      editable: true,
      deletable: true,
    },
    {
      editable: false,
    },
    {
      editable: false,
    },
    {
      editable: true,
      deletable: true,
    },
  ];

  const pushEditor = () => {
    router.push("/editor");
  };

  const handleDelete = async (row) => {
    console.log("Delete", row)
    try{
      let response = await api.delete(`/editor/form/${row.id}`)
    } catch (error: any){
      console.error(error.response?.message)
      throw error;
    }

  }

  const handleDuplicate = (row) => {
    console.log("Duplicate")
  }

  return (
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px]">
          <h1>Formulários</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            {/* Secretaria de Saúde - Fortaleza */}
            {forms[0]?.institution.name} - {forms[0]?.institution.code_state} - {forms[0]?.institution.code_city}
          </h2>
        </div>
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
      <BATable columns={columns} initialRows={rows} configRows={configRows} onDuplicate={handleDuplicate} onDelete={handleDelete} />
    </div>
  );
};

export default Formularios;
