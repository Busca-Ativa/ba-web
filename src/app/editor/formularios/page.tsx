"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

const Formularios = () => {
  const router = useRouter();
  const columns = [
    { id: "title", label: "Título", numeric: false },
    { id: "creator", label: "Criador", numeric: false },
    { id: "status", label: "Status", numeric: false },
    { id: "origin", label: "Origem", numeric: false },
  ];

  const rows = [
    {
      title: "Projeto de Pesquisa em Saúde",
      creator: "Ana Souza",
      status: "Em Edição",
      origin: "Unidade 1",
    },
    {
      title: "Estudo sobre Sustentabilidade",
      creator: "Carlos Mendes",
      status: "Pronto",
      origin: "Regional Sul",
    },
    {
      title: "Desenvolvimento de Software Educacional",
      creator: "Fernanda Lima",
      status: "Usado",
      origin: "Unidade 3",
    },
    {
      title: "Análise de Mercado",
      creator: "João Silva",
      status: "Pronto",
      origin: "Regional Norte",
    },
    {
      title: "Pesquisa em Biotecnologia",
      creator: "Mariana Ferreira",
      status: "Em Edição",
      origin: "Unidade 2",
    },
    {
      title: "Inovação em Logística",
      creator: "Pedro Almeida",
      status: "Usado",
      origin: "Regional Leste",
    },
  ];

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

  return (
    <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px]">
          <h1>Formulários</h1>
          <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Secretaria de Saúde - Fortaleza
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
      <BATable columns={columns} initialRows={rows} configRows={configRows} />
    </div>
  );
};

export default Formularios;
