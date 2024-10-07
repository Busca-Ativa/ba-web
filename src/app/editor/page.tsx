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
import { useDispatch, useSelector } from "react-redux";
import {
  setSurveyJson,
  setFormName,
  setFormDescription,
  setTags,
  setStatus,
  setCreatedAt,
  setUpdatedAt,
  addElement,
  updateQuestionOrder,
} from "../../../redux/surveySlice";
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
import { motion, AnimatePresence } from "framer-motion";
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
import { getTime, getStatus } from "@/utils";
import MultipleSelection from "@/components/FormCreator/MultipleSelection";
import YesNotQuestion from "@/components/FormCreator/YesNotQuestion";

const Editor = () => {
  const dispatch = useDispatch();

  const surveyJson = useSelector((state: any) => state.survey.surveyJson);
  const formName = useSelector((state: any) => state.survey.formName);
  const formDescription = useSelector(
    (state: any) => state.survey.formDescription
  );
  const updatedAt = useSelector((state: any) => state.survey.updatedAt);
  const createdAt = useSelector((state: any) => state.survey.createdAt);
  const tags = useSelector((state: any) => state.survey.tags);
  const status = useSelector((state: any) => state.survey.status);

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
          console.log(formData);
          dispatch(setUpdatedAt(formData.data.updated_at));
          dispatch(setCreatedAt(formData.data.created_at));
          dispatch(setSurveyJson(formData.data.survey_schema || {}));
          dispatch(setTags(formData.data.tags));
          dispatch(setStatus(formData.data.status));
          dispatch(setFormName(formData.data.survey_schema?.title || ""));
          dispatch(
            setFormDescription(formData.data.survey_schema?.description || "")
          );
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

  useEffect( () => {console.log(tags)}, [] )

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

  const handleAddElement = (element: any): UnknownAction => {
    return dispatch(addElement({ pageIndex: 0, element }));
  };

  const types = {
    boolean: YesNotQuestion,
    checkbox: MultipleSelection,
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
        dispatch(setStatus("done"));
        const status = "done"
        const newTags = [...tags];
        const sendData = {
          tags: newTags,
          status: status,
          schema: surveyJson,
        };
        response = await api.patch(`/editor/form/${formId}`, sendData, {
          withCredentials: true,
        });
      } else {
        const sendData = {
          title: formName,
          schema: surveyJson,
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
            startIcon={<SaveIcon />}
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
            value={formName}
            onChange={(e) => dispatch(setFormName(e.target.value))}
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
            value={formDescription}
            onChange={(e) => dispatch(setFormDescription(e.target.value))}
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
          <Status
            status={getStatus(status? status : "undone").name}
            bgColor={getStatus(status? status : "undone").bcolor}
            color={getStatus(status? status : "undone").color}
          />
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Criado por: {`${user?.name}`}
          </div>
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Última edição:{" "}
            {createdAt ? getTime(createdAt) : getTime(Date().toString())}
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
          <div className="flex items-start flex-col w-[23%] 2xl:w-[28%] px-[7px] gap-[12px] text-[#575757]">
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(0)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  type: "radiogroup",
                  name: "",
                  // choices: [
                  //   {id:0,label:"Muito Frequentemente",enabled:true},
                  //   {id:1,label:"Raramente",enabled:true},
                  //   {id:2,label:"Item 2",enabled:false},
                  //   {id:3,label:"Item 3",enabled:false},
                  //   {id:4,label:"Outro (Descreva)",enabled:false},
                  // ]
                  choices: ["Muito Frequentemente", "Raramente"],
                });
              }}
            >
              <RadioButtonChecked />
              {tagHover === 0 && (
                <span className="text-[#0f1113]">Seleção Única</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(1)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  type: "checkbox",
                  name: "",
                  choices: ["Muito Frequentemente", "Raramente"],
                });
              }}
            >
              <CheckBoxOutlined />
              {tagHover === 1 && (
                <span className="text-[#0f1113]">Seleção Múltipla</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(3)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  name: "",
                  type: "boolean",
                  labelFalse: "Não",
                  labelTrue: "Sim",
                });
              }}
            >
              <ToggleOnOutlined />
              {tagHover === 3 && (
                <span className="text-[#0f1113]">Sim/Não</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(4)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  name: "",
                  title: "",
                  type: "text",
                });
              }}
            >
              <ShortTextOutlined />
              {tagHover === 4 && (
                <span className="text-[#0f1113]">Resposta Curta</span>
              )}
            </button>
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(5)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  name: "",
                  title: "",
                  type: "comment",
                });
              }}
            >
              <SubjectOutlined />
              {tagHover === 5 && (
                <span className="text-[#0f1113]">Resposta Longa</span>
              )}
            </button>
            <button
              className="mt-[38px] h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(6)}
              onMouseLeave={handleTagsLeave}
            >
              <UploadFileOutlined />
              {tagHover === 6 && (
                <span className="text-[#0f1113]">Importar Seção/Questão</span>
              )}
            </button>
          </div>
          <div className="flex flex-col ml-12 flex-6 justify-center items-center">
            {Object.keys(surveyJson).length === 0 && (
              <div className="flex flex-col flex-1 justify-center items-center gap-[45px]">
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
              </div>
            )}
            <AnimatePresence>
              {surveyJson?.pages?.map((page, pageIndex: number) => {
                return page.elements.map(
                  (question: Question, questionIndex: number) => {
                    const Component = getType(question.type);
                    return (
                      <motion.div
                        key={questionIndex}
                        layout="position"
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 50,
                        }}
                        className="flex flex-col flex-1 justify-center items-center"
                      >
                        {Component && (
                          <Component
                            onMove={(direction) =>
                              dispatch(
                                updateQuestionOrder({
                                  pageIndex,
                                  questionIndex,
                                  direction,
                                })
                              )
                            }
                            index={questionIndex}
                            elementIndex={questionIndex}
                            pageIndex={pageIndex}
                          />
                        )}
                      </motion.div>
                    );
                  }
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
      {tabSelected == 1 && <Survey model={new Model(surveyJson)} />}
      <ToastContainer />
    </div>
  );
};

export default Editor;
