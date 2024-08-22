"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Add, PlusOne } from "@mui/icons-material";
import BATable from "@/components/BATable";

const InstituicoesAdmin = () => {
  const router = useRouter();
  const [pass, setPass] = useState(false);

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  const columns = [
    { id: "institutionName", label: "Nome", numeric: false },
    { id: "institutionCode", label: "Cód. Inst.", numeric: false },
    { id: "state", label: "UF", numeric: false },
    { id: "city", label: "Cidade", numeric: false },
  ];

  const rows = [
    {
      institutionName: "Universidade Federal de Tecnologia",
      institutionCode: "UTF123",
      state: "SP",
      city: "São Paulo",
    },
    {
      institutionName: "Instituto de Ciências Avançadas",
      institutionCode: "ICA456",
      state: "MG",
      city: "Belo Horizonte",
    },
    {
      institutionName: "Centro de Pesquisas em Educação",
      institutionCode: "CPE789",
      state: "RJ",
      city: "Rio de Janeiro",
    },
    {
      institutionName: "Faculdade de Inovação e Tecnologia",
      institutionCode: "FIT101",
      state: "PR",
      city: "Curitiba",
    },
    {
      institutionName: "Escola Superior de Desenvolvimento",
      institutionCode: "ESD202",
      state: "RS",
      city: "Porto Alegre",
    },
    {
      institutionName: "Instituto de Engenharia e Computação",
      institutionCode: "IEC303",
      state: "BA",
      city: "Salvador",
    },
    {
      institutionName: "Universidade de Ciências Humanas",
      institutionCode: "UCH404",
      state: "SC",
      city: "Florianópolis",
    },
    {
      institutionName: "Centro Acadêmico de Estudos Tecnológicos",
      institutionCode: "CAET505",
      state: "GO",
      city: "Goiânia",
    },
    {
      institutionName: "Faculdade de Saúde e Bem-Estar",
      institutionCode: "FSB606",
      state: "PE",
      city: "Recife",
    },
    {
      institutionName: "Instituto de Pesquisa e Desenvolvimento",
      institutionCode: "IPD707",
      state: "DF",
      city: "Brasília",
    },
    {
      institutionName: "Universidade de Artes e Design",
      institutionCode: "UAD808",
      state: "SP",
      city: "São Paulo",
    },
    {
      institutionName: "Faculdade de Ciências da Computação",
      institutionCode: "FCC909",
      state: "MG",
      city: "Uberlândia",
    },
    {
      institutionName: "Centro de Estudos Jurídicos",
      institutionCode: "CEJ010",
      state: "RJ",
      city: "Niterói",
    },
    {
      institutionName: "Instituto de Administração e Negócios",
      institutionCode: "IAN121",
      state: "PR",
      city: "Londrina",
    },
    {
      institutionName: "Faculdade de Engenharia Civil",
      institutionCode: "FEC232",
      state: "RS",
      city: "Caxias do Sul",
    },
    {
      institutionName: "Universidade de Ciências da Saúde",
      institutionCode: "UCS343",
      state: "BA",
      city: "Feira de Santana",
    },
    {
      institutionName: "Centro de Estudos de Ciências Naturais",
      institutionCode: "CECN454",
      state: "SC",
      city: "Joinville",
    },
  ];

  return (
    <>
      {pass && (
        <>
          <div className="w-[100%] h-[100vh px-[40px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Instituições</h1>
              <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
                <Add />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Nova Instituição
                </div>
              </button>
            </div>
            <BATable columns={columns} initialRows={rows} />
          </div>
        </>
      )}
    </>
  );
};

export default InstituicoesAdmin;
