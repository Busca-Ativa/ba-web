"use client";
import { useState } from "react";
import "./styles.css";
import Status from "@/components/Status";
import { Model, Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import ShortQuestion from "@/components/FormCreator/ShortQuestion";
import BaseComponent from "@/components/FormCreator/BaseComponent"
import { AuthService } from "@/services/auth/auth"
import DropDownButton  from "@/components/Buttons/DropdownButton"
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import {
  Add,
  CheckBoxOutlined,
  RadioButtonChecked,
  ShortTextOutlined,
  SubjectOutlined,
  ToggleOnOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import EditFormIcon from "@/components/Icons/EditFormIcon";
import SaveIcon from '@mui/icons-material/Save';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { UndoOutlined, DonutLargeOutlined, LabelOutlined } from "@mui/icons-material";




const Editor = () => {
  const [formName, setFormName] = useState("");
  const [formDiscription, setFormDiscription] = useState("");
  const [tabSelected, setTabSelected] = useState(0);
  const [user, setUser] = useState(AuthService.getUser())

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Formulários
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      Novo Formulário
    </Typography>,
  ];

  const saveOptionsGroups: OptionGroups[] = [{
    groupLabel: '',
    options: [
      { label: "Salvar e Sair", onClick: () => console.log("Salvar"), icon: <SaveIcon/> },
      { label: "Salvar como Cópia", onClick: () => console.log("Salvou como Cópia"), icon: <FileCopyIcon/> },
    ]
  },
  {
    groupLabel: ' ',
    options: [
      { label: "Descartar Mudanças", onClick: () => console.log("Descartado"), icon: <UndoOutlined/> },
    ]
  }];
  const modifyOptionsGroups = [
    {
      groupLabel:'',
      options: [
        { label: "Modificar Status", onClick: () => console.log("Status Modificado"), icon: <DonutLargeOutlined/> },
        { label: "Modificar Tags", onClick: () => console.log("Modificando Tags"), icon: <LabelOutlined/> },
      ]
    }
  ];
  const [surveyJson, setSurveyJson] = useState({
        elements: [
          {
            type: 'radiogroup',
            name: 'question1',
            title: 'First question',
            choices: ['Option 1', 'Option 2', 'Option 3'],
          },
          {
            type: 'dropdown',
            name: 'question2',
            title: 'Second question',
            choices: ['Option A', 'Option B', 'Option C'],
            showNoneItem: true,
            showOtherItem: true,
            choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ]
          },
          {
            type: "tagbox",
            isRequired: true,
            choicesByUrl: {
              url: "https://surveyjs.io/api/CountriesExample"
            },
            name: "countries",
            title: "Which countries have you visited within the last three years?",
            description: "Please select all that apply."
          },
          {
            type: "checkbox",
            name: "car",
            title: "Which is the brand of your car?",
            description: "If you own cars from multiple brands, please select all of them.",
            choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ],
            isRequired: true,
            colCount: 2,
            showNoneItem: true,
            showOtherItem: true,
            showSelectAllItem: true,
            separateSpecialChoices: true
          },
          {
            type: "boolean",
            name: "slider",
            title: "Are you 21 or older?",
            description: "Display mode = Default (Slider)",
            valueTrue: "Yes",
            valueFalse: "No"
          },
          {
          type: "boolean",
          name: "radiobutton",
          title: "Are you 21 or older?",
          description: "Display mode = Radio",
          valueTrue: "Yes",
          valueFalse: "No",
          renderAs: "radio"
          },
          {
          type: "boolean",
          name: "checkbox",
          label: "I am 21 or older",
          titleLocation: "hidden",
          valueTrue: "Yes",
          valueFalse: "No",
          renderAs: "checkbox"
          }
        ],
  })


  const addElement = (element) => {
    setSurveyJson( ( prev ) => ({
          ...prev,
          elements: [...prev.elements, element] // Create a new array
        })
    )
  }

  const swapElement = (obj, olderIdx, newIdx) => {
    if (olderIdx >= obj.elements.length || newIdx >= arr.length || olderIdx < 0 || newIdx < 0) {
      console.error('Indices fora da lista');
      return;
    }

    const temp = obj.elements[olderIdx];
    obj.elements[olderIdx] = obj.elements[newIdx];
    obj.elements[newIdx] = temp;
  }


  return (
    <div className="w-[100%] h-[100vh] px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
      <div className="flex justify-between ">
        <div className="align-middle">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </div>
        <div className="flex justify-between gap-x-2">
          <DropDownButton optionGroups={modifyOptionsGroups} color="#E9EBEE" sx={{color:"#5A5E62"}} startIcon={<EditFormIcon/>}>Modificar</DropDownButton>
          <DropDownButton optionGroups={saveOptionsGroups} color="#40C156" startIcon={<SaveIcon/>}>Salvar</DropDownButton>
        </div>
      </div>
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
            Criado por: {`${user.name}`}
          </div>
          <div className="text-right text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
            Última edição: 25/08/24 às 03:35
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
          <div className="flex flex-col px-[7px] gap-[12px] text-[#575757]">
            <button onClick={ () => { addElement({ name: "FirstName", title: "Enter your first name:", type: "text" }) } }>
      , <RadioButtonChecked />
            </button>
            <button>
              <CheckBoxOutlined />
            </button>
            <button>
              <ToggleOnOutlined />
            </button>
            <button>
              <ShortTextOutlined />
            </button>
            <button>
              <SubjectOutlined />
            </button>
            <button className="mt-[38px]">
              <UploadFileOutlined />
            </button>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center">
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
          {
            surveyJson?.elements.map( (value, idx) => {
              return (
                <div key={idx} className="flex flex-col flex-1 justify-center items-center">
                  <BaseComponent key={idx}/>
                </div>
                )
            } )
          }
          </div>
        </div>
      )}
      {tabSelected == 1 && <Survey model={new Model(surveyJson)} />}
    </div>
  );
};

export default Editor;
