import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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

interface DropdownMenuProps {
  handleTypeChange: (type: string) => void;
  onClose: (open: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  handleTypeChange,
  onClose,
}) => {
  return (
    <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <button
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={() => {
            handleTypeChange("text");
            onClose(false);
          }}
        >
          Texto
        </button>
        <button
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={() => {
            handleTypeChange("number");
            onClose(false);
          }}
        >
          Número
        </button>
        <button
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          onClick={() => {
            handleTypeChange("email");
            onClose(false);
          }}
        >
          Email
        </button>
      </div>
    </div>
  );
};

interface LeftDropdownProps {
  typeChange: (newType: string) => void;
  type: string;
}

const LeftDropdown: React.FC<LeftDropdownProps> = ({ typeChange, type }) => {
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <div className="relative">
      <div
        className="flex justify-between items-center gap-2 cursor-pointer"
        onClick={() => setDropOpen(!dropOpen)}
      >
        <span className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px]">
          {type == "text" && "Texto"}
          {type == "number" && "Número"}
          {type == "email" && "Email"}
        </span>
        <div className="text-[#ff9814]">
          {!dropOpen && <ArrowDropDown />}
          {dropOpen && <ArrowDropUp />}
        </div>
      </div>
      {dropOpen && (
        <DropdownMenu
          handleTypeChange={typeChange}
          onClose={() => setDropOpen(false)}
        />
      )}
    </div>
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

  const [question, setQuestion] = useState(element?.name || "");
  const [type, setType] = useState(element?.inputType || "text");
  const [required, setRequired] = useState(element?.isRequired || false);

  useEffect(() => {
    if (element) {
      setQuestion(element.text);
      setType(element.inputType);
      setRequired(element.isRequired);
    }
  }, [element]);

  const handleRequired = () => {
    const newRequired = !required;
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, isRequired: newRequired },
      })
    );
    setRequired(newRequired);
  };

  const handleTitleChange = (newText: string) => {
    setQuestion(newText);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, name: newText },
      })
    );
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, inputType: newType },
      })
    );
  };

  const header = (
    <BaseTitle
      question={question}
      type={"text"}
      onChange={handleTitleChange}
      required={required}
    />
  );

  const content = (
    <BaseContent onChange={() => {}} text={""} type={"text"} disabled={true} />
  );
  const footer = (
    <BaseFooter
      left={
        <LeftDropdown typeChange={handleTypeChange} type={type || "text"} />
      }
      pageIndex={pageIndex}
      elementIndex={elementIndex}
      onRequire={handleRequired}
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
