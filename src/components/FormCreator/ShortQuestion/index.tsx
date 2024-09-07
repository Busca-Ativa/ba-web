import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

interface ShortQuestionProps {
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
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
  )
}

const ShortQuestion: React.FC<ShortQuestionProps> = ({
  onCopy,
  onDelete,
  onMove,
  index,
}) => {
  const [question, setQuestion] = useState();
  const [anwser, setAnswer] = useState();
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);

  const handleRequired = () => {
    setRequired(!required)
  }

  const header = <BaseTitle question={question} kind={type} onChange={setQuestion} required={required}/>
  const content = <BaseContent text={anwser} kind={type} onChange={setAnswer}/>
  const footer = <BaseFooter left={<LeftDropdown/>} onRequire={handleRequired} />

  return (
    <BaseComponent header={header} content={content} footer={footer} index={index} onMove={onMove}/>
  );
};

export default ShortQuestion;
