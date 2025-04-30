"use client";
import "react-toastify/dist/ReactToastify.css";
import "survey-core/defaultV2.min.css";
import "./styles.css";

import ClickOrDropDownButton, {
  OptionGroup,
} from "@/components/Buttons/ClickOrDropdownButton";
import DropDownButton from "@/components/Buttons/DropdownButton";
import LongQuestion from "@/components/FormCreator/LongQuestion";
import ModalInsertions from "@/components/FormCreator/ModalInsertions";
import MultipleSelection from "@/components/FormCreator/MultipleSelection";
import ShortQuestion from "@/components/FormCreator/ShortQuestion";
import UniqueSelection from "@/components/FormCreator/UniqueSelection";
import YesNotQuestion from "@/components/FormCreator/YesNotQuestion";
import EditFormIcon from "@/components/Icons/EditFormIcon";
import InsertTagsDialog from "@/components/Modals/TagsModals";
import Status from "@/components/Status";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";
import api from "@/services/api";
import { AuthService } from "@/services/auth/auth";
import { Question } from "@/types/Question";
import { getStatus, getTime } from "@/utils";
import {
  CheckBoxOutlined,
  DonutLargeOutlined,
  LabelOutlined,
  RadioButtonChecked,
  ShortTextOutlined,
  SubjectOutlined,
  ToggleOnOutlined,
  UndoOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import SaveIcon from "@mui/icons-material/Save";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { UnknownAction } from "@reduxjs/toolkit";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Model, Survey } from "survey-react-ui";
import {
  addElement,
  initialState,
  removeAllElements,
  setCreatedAt,
  setFormDescription,
  setFormName,
  setStatus,
  setSurveyJson,
  setUpdatedAt,
  updateQuestionOrder,
} from "../../../redux/surveySlice";

const EditorContent = () => {
  const dispatch = useDispatch();

  const surveyJson = useSelector((state: any) => state.survey.surveyJson);
  const formName = useSelector((state: any) => state.survey.formName);
  const formDescription = useSelector(
    (state: any) => state.survey.formDescription
  );
  const updatedAt = useSelector((state: any) => state.survey.updatedAt);
  const createdAt = useSelector((state: any) => state.survey.createdAt);
  const tags = useSelector((state: any) => state.survey.surveyJson.tags);
  const status = useSelector((state: any) => state.survey.status);

  const [tabSelected, setTabSelected] = useState(0);
  const [tagHover, setTagHover] = useState<null | number>(null);
  const [user, setUser] = useState<any>(AuthService.getUser());
  const [tagsModalsOpen, setTagsModalsOpen] = useState<boolean>(false);
  const [currentTags, setCurrentTags] = useState<string[]>(tags || []);

  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");
  const typeForm = searchParams.get("type") || "form";

  useEffect(() => {
    return () => {
      dispatch(setSurveyJson(initialState.surveyJson));
      dispatch(setFormName(""));
      dispatch(setFormDescription(""));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentTags(tags);
  }, [tags]);

  useEffect(() => {
    const fetchForm = async () => {
      if (formId) {
        try {
          const response = await api.get(`/editor/${typeForm}/${formId}`, {
            withCredentials: true,
          });
          const formData = response.data;
          if (typeForm == "form") {
            dispatch(setUpdatedAt(formData.data.updated_at));
            dispatch(setCreatedAt(formData.data.created_at));
            dispatch(setSurveyJson(formData.data.survey_schema || {}));
            dispatch(setStatus(formData.data.status));
            dispatch(setFormName(formData.data.survey_schema?.title || ""));
            dispatch(
              setFormDescription(formData.data.survey_schema?.description || "")
            );
          } else if (typeForm == "section") {
            dispatch(setFormName(formData?.title || ""));
            dispatch(removeAllElements({ pageIndex: 0 }));
            formData?.questions?.elements.forEach((question: any) => {
              dispatch(addElement({ pageIndex: 0, element: question }));
            });
          }
        } catch (error) {
          toast.error(
            `Erro ao carregar o ${
              typeForm === "form"
                ? "formulário"
                : typeForm === "section"
                ? "seção"
                : "questão"
            }: ${(error as any).response?.data || (error as any).message}`
          );
        }
      }
    };

    fetchForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href={`/editor/${
        typeForm == "form"
          ? "formularios"
          : typeForm == "section"
          ? "secoes"
          : "questoes"
      }`}
    >
      {typeForm === "form"
        ? "Formulários"
        : typeForm === "section"
        ? "Seções"
        : "Questões"}
    </Link>,
    <Typography key="3" sx={{ color: "text.primary" }}>
      {formId
        ? "Editar " +
          (typeForm === "form"
            ? "Formulário"
            : typeForm === "section"
            ? "Seção"
            : "Questão")
        : typeForm === "form"
        ? "Novo Formulário"
        : typeForm === "section"
        ? "Nova Seção"
        : "Nova Questão"}
    </Typography>,
  ];

  const saveOptionsGroups: OptionGroup[] = [
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

  const [modifyOptionsGroups, setModifyOptionsGroups] = useState<OptionGroup[]>(
    [
      {
        groupLabel: "",
        options: [
          {
            label: "Modificar Status",
            onClick: () => console.log("Status Modificado"),
            icon: <DonutLargeOutlined />,
            subOptions: [
              {
                label: <Typography color="#BE9007">Em edição</Typography>,
                onClick: () => dispatch(setStatus("undone")),
              },
              {
                label: <Typography color="#19b394">Pronto</Typography>,
                onClick: () => dispatch(setStatus("done")),
              },
            ],
          },
        ],
      },
    ]
  );

  useEffect(() => {
    if (typeForm === "form") {
      setModifyOptionsGroups([
        {
          ...modifyOptionsGroups[0],
          options: [
            ...modifyOptionsGroups[0].options,
            {
              label: "Modificar Tags",
              onClick: () => setTagsModalsOpen(true),
              icon: <LabelOutlined />,
            },
          ],
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeForm]);

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

  const getType = (type: string): any => {
    return (types as any)[type] || null;
  };

  const handleSave = async () => {
    const toastId = toast.loading("Salvando...");
    let response;
    try {
      if (formId) {
        dispatch(setStatus("done"));
        const status = "done";
        const newTags = [...tags];
        let sendData = {};
        if (typeForm == "form") {
          const auxSurveyJson = { ...surveyJson, tags: currentTags };
          sendData = {
            status: status,
            schema: auxSurveyJson,
          };
        } else if (typeForm == "section") {
          sendData = {
            title: formName,
            questions: {
              elements: surveyJson.pages[0].elements,
            },
          };
        }

        response = await api.patch(`/editor/${typeForm}/${formId}`, sendData, {
          withCredentials: true,
        });
        if (response.data) {
          toast.dismiss(toastId);
          toast.success(
            `${
              typeForm == "form"
                ? "Formulario salvo"
                : typeForm == "section"
                ? "Seção salva"
                : "Questão salva"
            } com sucesso!`
          );
          if (typeForm === "form") {
            router.push("/editor/formularios");
          } else if (typeForm === "section") {
            router.push("/editor/secoes");
          } else if (typeForm === "question") {
            router.push("/editor/questoes");
          }
        }
      } else {
        let sendData;
        if (typeForm === "form") {
          const auxSurveyJson = { ...surveyJson, tags: currentTags };
          sendData = {
            title: formName,
            schema: auxSurveyJson,
            status: status,
          };
        } else if (typeForm === "section") {
          sendData = {
            title: formName,
            questions: {
              elements: surveyJson.pages[0].elements,
            },
            // origin_type: "institution",
            // origin_id: "O UUID do local de origem",
            // id_creator: "O UUID do criador da questão",
          };
        } else if (typeForm === "question") {
          sendData = {
            title: formName,
            type: "text",
            // origin_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            // origin_type: "unit",
            // id_creator: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            question_data: surveyJson.pages[0].elements[0],
            // tags: "unit,undone",
          };
        }
        response = await api.post(`/editor/${typeForm}`, sendData, {
          withCredentials: true,
        });
      }
      if (response.data?.data) {
        toast.dismiss(toastId);
        toast.success(
          `${
            typeForm == "form"
              ? "Formulario salvo"
              : typeForm == "section"
              ? "Seção salva"
              : "Questão salva"
          } com sucesso!`
        );
        if (typeForm === "form") {
          router.push("/editor/formularios");
        } else if (typeForm === "section") {
          router.push("/editor/secoes");
        } else if (typeForm === "question") {
          router.push("/editor/questoes");
        }
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(
        `Erro ao salvar ${
          typeForm == "form"
            ? "formulario"
            : typeForm == "section"
            ? "seção"
            : "questão"
        }: ` + (error.response?.data || error.message)
      );
      throw error;
    }
  };

  const handleTagsHover = (i: number) => {
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
            placeholder={`Nome ${
              typeForm == "form"
                ? "do Formulario"
                : typeForm == "section"
                ? "da Seção"
                : "da Questão"
            }`}
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
          {typeForm === "form" && (
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
          )}
          {currentTags?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {currentTags.map((tag: string, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-[#D2F9F1] text-[#19b394] text-sm font-semibold font-['Poppins'] leading-[18px] px-2 py-[2px] rounded-full"
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Status
            status={getStatus(status ? status : "undone").name}
            bgColor={getStatus(status ? status : "undone").bcolor}
            color={getStatus(status ? status : "undone").color}
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
          <div className="flex items-start flex-col w-[24%] 2xl:w-[28%] px-[7px] gap-[12px] text-[#575757]">
            <button
              className="h-[34px] pl-[7px] pr-[15px] py-[5px] hover:bg-white rounded-[100px] hover:shadow justify-start items-center gap-2.5 inline-flex hover:text-[#19b394]"
              onMouseOver={() => handleTagsHover(0)}
              onMouseLeave={handleTagsLeave}
              onClick={() => {
                handleAddElement({
                  type: "radiogroup",
                  title: "",
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
                  title: "",
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
                  title: "",
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
              onClick={() => {
                setModalOpen(true);
              }}
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
                  O{" "}
                  {typeForm == "form"
                    ? "formulario"
                    : typeForm == "section"
                    ? "seção"
                    : "questão"}{" "}
                  está vazio.
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
              {surveyJson?.pages?.map((page: any, pageIndex: number) => {
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
                            onMove={(direction: string) =>
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
      <InsertTagsDialog
        open={tagsModalsOpen}
        initialTags={tags}
        onClose={() => setTagsModalsOpen(false)}
        onConfirm={(internTags) => {
          setCurrentTags(internTags);
          setTagsModalsOpen(false);
        }}
      />
      <ToastContainerWrapper />
      {modalOpen && <ModalInsertions onClose={setModalOpen} />}
    </div>
  );
};

const Editor = () => {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
};

export default Editor;
