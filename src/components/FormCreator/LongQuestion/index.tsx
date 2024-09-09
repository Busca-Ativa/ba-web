import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState, useEffect } from "react";
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

interface LongQuestionProps {
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

const TextArea: React.FC<TextAreaProps> = ({value,placeholder,onChange}) => {

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



interface LongQuestionProps {
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const LongQuestion: React.FC<LongQuestionProps> = ({
  onCopy,
  onDelete,
  onMove,
  index,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [anwser, setAnswer] = useState<string>("");
  const [type, setType] = useState<string>("text");
  const [required, setRequired] = useState<boolean>(false);

  const handleRequired = () => {
    setRequired(!required)
  }

  useEffect(() => {
    console.log("Required state changed: ", required);
  }, [required]);

  const content = <TextArea value={anwser} onChange={setAnswer}/>
  const header = <BaseTitle required={required} question={question} type={type} onChange={setQuestion}/>
  const footer = <BaseFooter onRequire={handleRequired}/>

  return (
    <BaseComponent onMove={onMove} index={index} header={header} content={content} footer={footer}/>
  );
};

export default LongQuestion;
