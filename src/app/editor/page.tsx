"use client";
import "./styles.css";
import "survey-core/defaultV2.min.css";
import "react-toastify/dist/ReactToastify.css";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { Model, Survey } from "survey-react-ui";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Link from "@mui/material/Link";
import { toast, ToastContainer } from "react-toastify";
import {
  CheckBoxOutlined,
  RadioButtonChecked,
  ShortTextOutlined,
  SubjectOutlined,
  ToggleOnOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  UndoOutlined,
  DonutLargeOutlined,
  LabelOutlined,
} from "@mui/icons-material";
import EditFormIcon from "@/components/Icons/EditFormIcon";

import Status from "@/components/Status";
import ShortQuestion from "@/components/FormCreator/ShortQuestion";
import LongQuestion from "@/components/FormCreator/LongQuestion";
import UniqueSelection from "@/components/FormCreator/UniqueSelection";
import BaseComponent from "@/components/FormCreator/BaseComponent";
import { AuthService } from "@/services/auth/auth";
import DropDownButton from "@/components/Buttons/DropdownButton";
import ClickOrDropDownButton from "@/components/Buttons/ClickOrDropdownButton";
import api from "@/services/api";
import { surveyElements, surveyPageExample } from "../../utils/SurveyJS";
import { FormContext } from "@/contexts/FormContext";
import { Question } from "@/types/Question";
import { getTime } from "@/utils";


const Editor = () => {
  const { formData, updateFormData, updateQuestionOrder, getQuestionByIndex, addQuestionToPage } = useContext(FormContext);
  const [tabSelected, setTabSelected] = useState(0);
  const [tagHover, setTagHover] = useState<null | number>(null);
  const [user, setUser] = useState(AuthService.getUser());

  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  useEffect(() => {
    const fetchForm = async () => {
      if (formId) {
        try {
          const response = await api.get(`/editor/form/${formId}`, {
            withCredentials: true,
          });
          const formData = response.data;
          updateFormData('survey', formData.data.survey_schema || {});
          updateFormData('tags', formData.data.tags || []);
          updateFormData('name', formData.data.survey_schema?.title || "");
          updateFormData('created_at', formData.data.created_at || "");
          updateFormData('updated_at', formData.data.created_at || "");
          updateFormData('description', formData.data.survey_schema?.description || "");
        } catch (error) {
          toast.error(
            "Erro ao carregar o formulário: " +
              (error.response?.data || error.message)
          );
        }
      }
    };

    fetchForm();
  }, [formId]);

  useEffect( () => {
    console.log(formData)
  }, [formData] )

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/editor/formularios">
      Formulários
    </Link>,
    <Typography key="3" sx={{ color: "text.primary" }}>
      {formId ? "Editar Formulário" : "Novo Formulário"}
    </Typography>,
  ];

  const saveOptionsGroups: OptionGroups[] = [
    {
      groupLabel: "",
      options: [
        {
          label: "Salvar e Sair",
          onClick: () => handleSave(),
          icon: <SaveIcon />,
        },
        {
          label: "Salvar como Cópia",
          onClick: () => console.log("Salvou como Cópia"),
          icon: <FileCopyIcon />,
        },
      ],
    },
    {
      groupLabel: " ",
      options: [
        {
          label: "Descartar Mudanças",
          onClick: () => console.log("Descartado"),
          icon: <UndoOutlined />,
        },
      ],
    },
  ];

  const modifyOptionsGroups: OptionGroups = [
    {
      groupLabel: "",
      options: [
        {
          label: "Modificar Status",
          onClick: () => console.log("Status Modificado"),
          icon: <DonutLargeOutlined />,
        },
        {
          label: "Modificar Tags",
          onClick: () => console.log("Modificando Tags"),
          icon: <LabelOutlined />,
        },
      ],
    },
  ];

  const types = {
    boolean: null,
    checkbox: null,
    comment: LongQuestion,
    dropdown: null,
    tagbox: null,
    expression: null,
    file: null,
    html: null,
    image: null,
    imagepicker: null,
    matrix: null,
    matrixdropdow: null,
    matrixdynamic: null,
    multipletext: null,
    panel: null,
    paneldynamic: null,
    radiogroup: UniqueSelection,
    rating: null,
    ranking: null,
    signaturepad: null,
    text: ShortQuestion,
  };

  const getType = (type: string) => {
    return types[type] || null;
  };

  const handleSave = async () => {
    const toastId = toast.loading("Salvando...");
    let response;
    try {
      if (formId) {
        formData.tags[1] = "done"
        const sendData = {
          tags: formData.tags,
          schema: formData.survey,
        };
        response = await api.patch(`/editor/form/${formId}`, sendData,
        {
          withCredentials: true,
        });
      } else {
        const sendData = {
          title: formData.name,
          schema: formData.survey,
        };
        response = await api.post("/editor/form", sendData, {
          withCredentials: true,
        });
      }
      if (response.data?.data) {
        toast.dismiss(toastId);
        toast.success("Formulário salvo com sucesso!");
        router.push("/editor/formularios");
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(
        "Erro ao salvar formulário: " + (error.response?.data || error.message)
      );
      throw error;
    }
  };

  const handleTagsHover = (i) => {
    setTagHover(i);
  };

  const handleTagsLeave = () => {
    setTagHover(null);
  };

  return (
    <div className="w-[100%] h-[100vh] px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between ">
        <div className="align-middle">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <div className="flex justify-between gap-x-2">
          <DropDownButton
            optionGroups={modifyOptionsGroups}
            color="#E9EBEE"
            sx={{ color: "#5A5E62" }}
            startIcon={<EditFormIcon />}
          >
            Modificar
          </DropDownButton>
          <ClickOrDropDownButton
            optionGroups={saveOptionsGroups}
            color="#40C156"
            startIcon={<SaveIcon/>}
            onClick={handleSave}
          >
          Salvar
          </ClickOrDropDownButton>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-[5px] h-fit">
          <input
            type="text"
            value={formData.survey.title}
            onChange={(e) => {updateFormData('name',e.target.value); updateFormData('survey.title', e.target.value)}}
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
            value={formData.survey.description}
            onChange={(e) => {updateFormData('description',e.target.value); updateFormData('survey.description', e.target.value)}}
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
            Criado por: {`${user.name}`}
          </div>
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Última edição: {formData.updated_at ? getTime(formData.updated_at): getTime(Date().toString())}
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
              onClick={() => {
                addQuestionToPage(0,{
                  name: "FirstName",
                  title: "Enter your first name:",
                  type: "radiogroup",
                });
              }}
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
              onClick={() => {
                addQuestionToPage(0,{
                  name: "FirstName",
                  title: "Enter your first name:",
                  type: "text",
                });
              }}
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
              onClick={() => {
                addQuestionToPage(0,{
                  name: "FirstName",
                  title: "Enter your first name:",
                  type: "comment",
                });
              }}
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
            {formData?.survey?.pages?.map((page, pageIndex: number) => {
              return page.elements.map( (question: Question, questionIndex: number) => {
                const Component = getType(question.type);
                return (
                  <div
                    key={questionIndex}
                    className="flex flex-col flex-1 justify-center items-center"
                  >
                    {Component && <Component onMove={(direction) => updateQuestionOrder(pageIndex,questionIndex,direction)} index={questionIndex} pageIndex={pageIndex} data={getQuestionByIndex(pageIndex,questionIndex)}/>}
                  </div>
                );
              } )
            })}
          </div>
        </div>
      )}
      {tabSelected == 1 && <Survey model={new Model(formData?.survey)} />}
      <ToastContainer />
    </div>
  );
};

export default Editor;
