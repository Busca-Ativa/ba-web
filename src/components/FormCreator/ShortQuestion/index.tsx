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

const LeftDropdown = () => {
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <div className="flex justify-between items-center gap-2 cursor-pointer">
      <span
        className="text-[#0f1113] text-sm font-medium font-['Poppins'] leading-[21px]"
        onClick={() => setDropOpen(!dropOpen)}
      >
        Texto
      </span>
      <div className="text-[#ff9814]">
        {!dropOpen && <ArrowDropDown />}
        {dropOpen && <ArrowDropUp />}
      </div>
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

  const [question, setQuestion] = useState(element?.title || "");
  const [type, setType] = useState(element?.type || "text");
  const [required, setRequired] = useState(element?.required || false);

  useEffect(() => {
    if (element) {
      setQuestion(element.text);
      setType(element.type);
      setRequired(element.required);
    }
  }, [element]);

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

  const header = (
    <BaseTitle
      question={question}
      type={type}
      onChange={handleTitleChange}
      required={required}
    />
  );

  const content = <BaseContent onChange={()=>{}} text={""} type={type} disabled={true} />;
  const footer = (
    <BaseFooter
      left={<LeftDropdown />}
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
