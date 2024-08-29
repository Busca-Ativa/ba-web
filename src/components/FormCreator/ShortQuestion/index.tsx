import Asterisk from "@/assets/icons/Asterisk";
import AsteriskRed from "@/assets/icons/AsteriskRed";
import Copy from "@/assets/icons/Copy";
import Delete from "@/assets/icons/Delete";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";

interface ShortQuestionProps {
  onCopy: () => void;
  onDelete: () => void;
  onMove: () => void;
}

const ShortQuestion: React.FC<ShortQuestionProps> = ({
  onCopy,
  onDelete,
  onMove,
}) => {
  const [dropOpen, setDropOpen] = useState(false);
  const [question, setQuestion] = useState();
  const [type, setType] = useState("text");
  const [required, setRequired] = useState(false);

  return (
    <div className="flex flex-col p-[20px] w-[576px] h-[228px] bg-white rounded-[5px] shadow-md gap-[25px]">
      <div className="flex justify-between items-center gap-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite a pergunta"
          type={type}
          className="flex-1 text-[#0f1113] text-lg font-semibold font-['Poppins'] leading-[21px] mt-[10px] p-2"
        />
        {required && <AsteriskRed />}
      </div>

      <input
        className="h-[49px] bg-neutral-100 rounded-sm shadow-inner p-2"
        type={type}
        disabled
      />
      <div className="flex justify-between">
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
        <div className="flex justify-between gap-3">
          <button>
            <Copy />
          </button>
          <button onClick={() => setRequired(!required)}>
            <Asterisk />
          </button>
          <button>
            <Delete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortQuestion;
