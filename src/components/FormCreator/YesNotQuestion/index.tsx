import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";
import BaseComponent from "../BaseComponent";
import BaseContent from "../BaseContent";
import BaseTitle from "../BaseTitle";
import BaseFooter from "../BaseFooter";

interface YesNotQuestionProps {
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const YesNotQuestion: React.FC<YesNotQuestionProps> = ({
  onCopy,
  onDelete,
  onMove,
}) => {
  const [question, setQuestion] = useState();
  const [anwser, setAnswer] = useState();
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);
  const [isYes, setIsYes] = useState(false);
  const [labelYes, setLabelYes] = useState("Sim");
  const [labelNo, setLabelNo] = useState("Não");

  const handleRequired = () => {
    setRequired(!required);
  };

  const header = (
    <BaseTitle
      question={question}
      kind={type}
      onChange={setQuestion}
      required={required}
    />
  );
  const content = (
    <div className="h-[49px] w-fit p-1 bg-neutral-100 rounded-[100px] shadow-inner justify-start items-start inline-flex">
      <div className="px-6 py-2 justify-center items-center gap-2.5 flex">
        <div className="px-[5px] py-0.5 justify-center items-center gap-2.5 flex">
          <input
            value={labelNo}
            onChange={(e) => setLabelNo(e.target.value)}
            type="text"
            placeholder="Não..."
            className="text-[#8a8a8a] text-lg font-medium font-['Poppins'] leading-[21px] bg-transparent w-10 rounded border-2 border-transparent hover:border-[#575757]"
          />
        </div>
      </div>
      <div className="px-6 py-2 justify-center items-center gap-2.5 flex">
        <div className="px-[5px] py-0.5 justify-center items-center gap-2.5 flex">
          <input
            value={labelYes}
            onChange={(e) => setLabelNo(e.target.value)}
            type="text"
            placeholder="Sim..."
            className="text-[#8a8a8a] text-lg font-medium font-['Poppins'] leading-[21px] bg-transparent w-10 rounded border-2 border-transparent hover:border-[#575757]"
          />
        </div>
      </div>
    </div>
  );
  const footer = <BaseFooter onRequire={handleRequired} />;

  return <BaseComponent header={header} content={content} footer={footer} />;
};

export default YesNotQuestion;
