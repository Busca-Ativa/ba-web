import { useEffect, useRef, useState } from "react";
import ShortQuestion from "../ShortQuestion";
import LongQuestion from "../LongQuestion";
import YesNotQuestion from "../YesNotQuestion";
import UniqueSelection from "../UniqueSelection";
import MultipleSelection from "../MultipleSelection";

const ModalQuestions = ({ onClose }) => {
  const modalRef = useRef(null);
  const [selectedQuestion, setSelectedQuestion] = useState("ShortQuestion");

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center">
        <div className="modal max-w-[696px] h-fit flex flex-col items-center justify-center px-[60px] py-[50px] rounded-lg bg-white">
          <div ref={modalRef} className="flex w-full justify-between mb-[40px]">
            <div className="text-[#0e1113] text-3xl font-bold font-['Poppins'] leading-[38px]">
              Nova Questão
            </div>{" "}
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
            <div className="h-[41px] px-10 py-2 rounded border border-[#ef4838] justify-center items-center gap-3 inline-flex">
              <div className="text-[#ef4838] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Cancelar
              </div>
            </div>
            <div className="h-[41px] px-10 py-2 bg-[#19b394] rounded justify-center items-center gap-3 inline-flex">
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Concluir
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalQuestions;
