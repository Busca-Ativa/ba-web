import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeType,
  duplicateElement,
  removeElement,
  updateElement,
} from "../../../../redux/surveySlice"; // Altere o caminho se necessário
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

interface ShortQuestionProps {
  pageIndex: number;
  elementIndex: number;
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
  index: number;
}

const LeftDropdown = ({ type, setType }: any) => {
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <>
      <div
        className="flex justify-between items-center gap-2 cursor-pointer"
        onClick={() => setDropOpen(!dropOpen)}
      >
        <span className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px]">
          {type == "text"
            ? "Texto"
            : type == "number"
            ? "Número"
            : type == "date"
            ? "Data"
            : type == "email"
            ? "E-mail"
            : type == "tel"
            ? "Telefone"
            : "Texto"}
        </span>
        <div className="text-[#ff9814]">
          {!dropOpen && <ArrowDropDown />}
          {dropOpen && <ArrowDropUp />}
        </div>
      </div>
      <div className="menu">
        {dropOpen && (
          <div className="bg-white p-2 rounded-md shadow-md z-10 absolute left-3 top-[200px]">
            <ul className="flex flex-col gap-2">
              <li
                className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px] hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setType("text");
                  setDropOpen(false);
                }}
              >
                Texto
              </li>
              <li
                className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px] hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setType("number");
                  setDropOpen(false);
                }}
              >
                Número
              </li>
              <li
                className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px] hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setType("date");
                  setDropOpen(false);
                }}
              >
                Data
              </li>
              <li
                className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px] hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setType("email");
                  setDropOpen(false);
                }}
              >
                E-mail
              </li>
              <li
                className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px] hover:text-orange-500 cursor-pointer"
                onClick={() => {
                  setType("tel");
                  setDropOpen(false);
                }}
              >
                Telefone
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

const ShortQuestion: React.FC<ShortQuestionProps> = ({
  pageIndex,
  elementIndex,
  onCopy,
  onDelete,
  onMove,
  index,
}) => {
  const dispatch = useDispatch();
  const element = useSelector(
    (state: any) =>
      state.survey.surveyJson.pages[pageIndex]?.elements[elementIndex]
  );

  const [question, setQuestion] = useState(element?.title || "");
  const [type, setType] = useState(element?.inputType || "text");
  const [required, setRequired] = useState(element?.required || false);

  useEffect(() => {
    if (element) {
      setQuestion(element.text);
      setRequired(element.required);
    }
  }, [element]);

  useEffect(() => {
    console.log("type", type);
    dispatch(
      changeType({
        pageIndex,
        elementIndex,
        newType: type,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleRequired = () => {
    const newRequired = !required;
    setRequired(newRequired);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, required: newRequired },
      })
    );
  };

  const handleTitleChange = (newText: string) => {
    setQuestion(newText);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, title: newText },
      })
    );
  };

  const handleChangeType = (newType: string) => {};

  const header = (
    <BaseTitle
      question={question}
      type={"text"}
      onChange={handleTitleChange}
      required={required}
    />
  );

  const content = (
    <BaseContent onChange={() => {}} text={""} type={type} disabled={true} />
  );
  const footer = (
    <BaseFooter
      left={<LeftDropdown type={type} setType={setType} />}
      pageIndex={pageIndex}
      elementIndex={elementIndex}
    />
  );

  return (
    <BaseComponent
      header={header}
      content={content}
      footer={footer}
      index={index}
      onMove={onMove}
    />
  );
};

export default ShortQuestion;
