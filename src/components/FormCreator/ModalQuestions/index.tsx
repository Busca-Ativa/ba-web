import { useEffect, useRef, useState } from "react";
import ShortQuestion from "../ShortQuestion";
import LongQuestion from "../LongQuestion";
import YesNotQuestion from "../YesNotQuestion";
import UniqueSelection from "../UniqueSelection";
import MultipleSelection from "../MultipleSelection";
import { useDispatch, useSelector } from "react-redux";
import { addElement, removeElement } from "../../../../redux/surveySlice";
import api from "@/services/api";
import { toast } from "react-toastify";

const ModalQuestions = ({ onClose }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const [selectedQuestion, setSelectedQuestion] = useState("ShortQuestion");
  const surveyState = useSelector((state) => state.survey);
  const question = useSelector(
    (state) => state.survey.surveyJson.pages[0].elements[0]
  );
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(false);
    }
  };

  useEffect(() => {
    const data = getQuestionData(selectedQuestion);

    if (data) {
      // Remover o elemento antes de adicionar um novo, respeitando a sequência
      dispatch(removeElement({ pageIndex: 0, elementIndex: 0 }));
      dispatch(addElement({ pageIndex: 0, element: data }));
    }
  }, [dispatch, selectedQuestion]);

  const getQuestionData = (questionType) => {
    switch (questionType) {
      case "ShortQuestion":
        return { name: "", title: "", type: "text" };
      case "LongQuestion":
        return { name: "", title: "", type: "comment" };
      case "YesNotQuestion":
        return {
          name: "",
          type: "boolean",
          labelFalse: "Não",
          labelTrue: "Sim",
        };
      case "UniqueSelection":
        return {
          type: "radiogroup",
          name: "",
          choices: ["Muito Frequentemente", "Raramente"],
        };
      case "MultipleSelection":
        return {
          type: "checkbox",
          name: "",
          choices: ["Muito Frequentemente", "Raramente"],
        };
      default:
        return null;
    }
  };

  const renderQuestionComponent = () => {
    switch (selectedQuestion) {
      case "ShortQuestion":
        return (
          <ShortQuestion
            index={0}
            elementIndex={0}
            pageIndex={0}
            onCopy={() => {}}
            onDelete={() => {}}
            onMove={() => {}}
          />
        );
      case "LongQuestion":
        return (
          <LongQuestion
            index={0}
            elementIndex={0}
            pageIndex={0}
            onCopy={() => {}}
            onDelete={() => {}}
            onMove={() => {}}
          />
        );
      case "YesNotQuestion":
        return (
          <YesNotQuestion
            elementIndex={0}
            pageIndex={0}
            onCopy={() => {}}
            onDelete={() => {}}
            onMove={() => {}}
          />
        );
      case "UniqueSelection":
        return (
          <UniqueSelection
            index={0}
            elementIndex={0}
            pageIndex={0}
            onCopy={() => {}}
            onDelete={() => {}}
            onMove={() => {}}
          />
        );
      case "MultipleSelection":
        return (
          <MultipleSelection
            elementIndex={0}
            pageIndex={0}
            onCopy={() => {}}
            onDelete={() => {}}
            onMove={() => {}}
          />
        );
      default:
        return null;
    }
  };

  const saveQuestion = async () => {
    const questionData = {
      title: question.title,
      type: question.type,
      question_data: question,
      tags: "",
    };

    try {
      await api.post("/editor/question", questionData);
      toast.success("Questão salva com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar a questão:", error);
      toast.error("Erro ao salvar a questão.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => onClose(false)}
      ></div>
      <div className="relative z-10 flex items-center justify-center">
        <div className="modal max-w-[696px] h-fit flex flex-col items-center justify-center px-[60px] py-[50px] rounded-lg bg-white">
          <div ref={modalRef} className="flex w-full justify-between mb-[40px]">
            <div className="text-[#0e1113] text-3xl font-bold font-['Poppins'] leading-[38px]">
              Nova Questão
            </div>
            <select
              className="border rounded px-2 py-1"
              value={selectedQuestion}
              onChange={(e) => setSelectedQuestion(e.target.value)}
            >
              <option value="ShortQuestion">Resposta curta</option>
              <option value="LongQuestion">Resposta Longa</option>
              <option value="YesNotQuestion">Sim/Não</option>
              <option value="UniqueSelection">Seleção Única</option>
              <option value="MultipleSelection">Seleção Múltipla</option>
            </select>
          </div>
          {renderQuestionComponent()}
          <div className="flex justify-between w-full mt-[40px]">
            <button
              onClick={saveQuestion}
              className="h-[41px] px-10 py-2 bg-[#19b394] rounded justify-center items-center gap-3 inline-flex"
            >
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Concluir
              </div>
            </button>
            <div
              onClick={() => onClose(false)}
              className="h-[41px] px-10 py-2 rounded border border-[#ef4838] justify-center items-center gap-3 inline-flex cursor-pointer"
            >
              <div className="text-[#ef4838] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Cancelar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQuestions;