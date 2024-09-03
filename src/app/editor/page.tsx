"use client";

import {
  Add,
  CheckBoxOutlined,
  RadioButtonChecked,
  ShortTextOutlined,
  SubjectOutlined,
  ToggleOnOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import "./styles.css";
import Status from "@/components/Status";
import { Model, Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import ShortQuestion from "@/components/FormCreator/ShortQuestion";

const Editor = () => {
  const [formName, setFormName] = useState("");
  const [formDiscription, setFormDiscription] = useState("");
  const [tabSelected, setTabSelected] = useState(0);
  const [tagHover, setTagHover] = useState<null | number>(null);

  const surveyJson = {
    elements: [
      {
        name: "FirstName",
        title: "Enter your first name:",
        type: "text",
      },
      {
        name: "LastName",
        title: "Enter your last name:",
        type: "text",
      },
    ],
  };

  const handleTagsHover = (i) => {
    setTagHover(i);
  };

  const handleTagsLeave = () => {
    setTagHover(null);
  };

  return (
    <div className="w-[100%] h-[100vh] px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px] h-fit">
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Nome do Formulário"
            className="custom-placeholder form-input text-[#13866f] text-[28px] font-bold font-['Poppins'] leading-[35px] border-none outline-none bg-transparent"
            style={{
              paddingTop: "0px",
              paddingBottom: "4px",
              transition: "border-color 0.3s ease",
              width: "100%",
              flex: 1,
              padding: "2px 5px",
            }}
          />
          <input
            type="text"
            value={formDiscription}
            onChange={(e) => setFormDiscription(e.target.value)}
            placeholder="Descrição"
            className="form-input text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px] border-none outline-none bg-transparent"
            style={{
              paddingTop: "13px",
              transition: "border-color 0.3s ease",
              width: "100%",
              flex: 1,
              padding: "2px 5px",
            }}
          />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Status status="Em Edição" bgColor="#FFE9A6" color="#BE9007" />
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Criado por: João Alves
          </div>
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Última edição 25/08/24 às 03:35
          </div>
        </div>
      </div>
      <div className="flex h-[45px] !rounded-2xl">
        <div
          className={
            tabSelected == 0
              ? "bg-[#D2F9F1] text-[#19b394] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-l-md h-[45px]"
              : "bg-[#F6F6F6] text-[#575757] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-l-md h-[45px]"
          }
          onClick={() => setTabSelected(0)}
        >
          Criação
        </div>
        <div
          className={
            tabSelected == 1
              ? "bg-[#D2F9F1] text-[#19b394] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-r-md h-[45px]"
              : "bg-[#F6F6F6] text-[#575757] text-lg font-medium font-['Poppins'] leading-[21px] flex flex-1 justify-center items-center cursor-pointer rounded-r-md h-[45px]"
          }
          onClick={() => setTabSelected(1)}
        >
          Preview
        </div>
      </div>
      {tabSelected == 0 && (
        <div className="flex">
          <div className="flex items-start flex-col w-[20%] 2xl:w-[28%] px-[7px] gap-[12px] text-[#575757]">
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(0)}
              onMouseLeave={handleTagsLeave}
            >
              <RadioButtonChecked />
              {tagHover === 0 && (
                <span className="text-[#575757]">Seleção Única</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(1)}
              onMouseLeave={handleTagsLeave}
            >
              <CheckBoxOutlined />
              {tagHover === 1 && (
                <span className="text-[#575757]">Seleção Múltipla</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(3)}
              onMouseLeave={handleTagsLeave}
            >
              <ToggleOnOutlined />
              {tagHover === 3 && (
                <span className="text-[#575757]">Sim/Não</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(4)}
              onMouseLeave={handleTagsLeave}
            >
              <ShortTextOutlined />
              {tagHover === 4 && (
                <span className="text-[#575757]">Resposta Curta</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(5)}
              onMouseLeave={handleTagsLeave}
            >
              <SubjectOutlined />
              {tagHover === 5 && (
                <span className="text-[#575757]">Resposta Longa</span>
              )}
            </button>
            <button
              className="mt-[38px] h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(6)}
              onMouseLeave={handleTagsLeave}
            >
              <UploadFileOutlined />
              {tagHover === 6 && (
                <span className="text-[#575757]">Importar Seção/Questão</span>
              )}
            </button>
          </div>
          <div className="flex flex-col ml-12 flex-6 justify-center items-center">
            {/* <div className="flex flex-col flex-1 justify-center items-center gap-[45px]">
              <div className="text-center text-black text-sm font-normal font-['Poppins'] leading-[21px]">
                O formulário está vazio.
                <br />
                Adicione um elemento das opções ao lado ou clique no botão
                abaixo.
              </div>
              <button className="h-[41px] px-[25px] py-2 bg-[#d2f9f1] rounded justify-center items-center gap-3 inline-flex">
                <div className="grow shrink basis-0 text-center text-[#19b394] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Adicionar Questão
                </div>
              </button>
            </div> */}
            <ShortQuestion />
          </div>
        </div>
      )}
      {tabSelected == 1 && <Survey model={new Model(surveyJson)} />}
    </div>
  );
};

export default Editor;
