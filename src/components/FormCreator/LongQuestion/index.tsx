import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateElement } from "../../../../redux/surveySlice"; // Altere o caminho se necessário
import BaseComponent from "../BaseComponent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

interface LongQuestionProps {
  pageIndex: number;
  elementIndex: number;
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
  index: number;
}
interface TextAreaProps {
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  placeholder,
  onChange,
}) => {
  return (
    <textarea
      placeholder="Texto Longo"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={5}
      cols={90}
      className="flex-1 bg-[#F5F5F5] text-[#0f1113] text-lg font-semibold font-['Poppins'] leading-[21px]  p-2"
    />
  );
};
const LongQuestion: React.FC<LongQuestionProps> = ({
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

  const [question, setQuestion] = useState<string>(element?.name || "");
  const [type, setType] = useState<string>(element?.type || "text");
  const [required, setRequired] = useState<boolean>(
    element?.isRequired || false
  );

  useEffect(() => {
    if (element) {
      setQuestion(element.name);
      setType(element.type);
      setRequired(element.isRequired);
    }
  }, [element]);
  const handleRequired = () => {
    const newRequired = !required;
    setRequired(newRequired);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, isRequired: newRequired },
      })
    );
  };
  const handleQuestionChange = (newQuestion: string) => {
    setQuestion(newQuestion);
    dispatch(
      updateElement({
        pageIndex,
        elementIndex,
        updatedElement: { ...element, name: newQuestion },
      })
    );
  };
  const header = (
    <BaseTitle
      question={question}
      type={type}
      onChange={handleQuestionChange}
      required={required}
    />
  );
  const content = (
    <textarea
      rows={5}
      cols={90}
      disabled
      className="flex-1 bg-[#F5F5F5] text-[#0f1113] text-lg font-semibold font-['Poppins'] leading-[21px]  p-2"
    />
  );
  const footer = (
    <BaseFooter
      onRequire={handleRequired}
      elementIndex={elementIndex}
      pageIndex={pageIndex}
    />
  );

  return (
    <BaseComponent
      onMove={onMove}
      index={index}
      header={header}
      content={content}
      footer={footer}
    />
  );
};

export default LongQuestion;
