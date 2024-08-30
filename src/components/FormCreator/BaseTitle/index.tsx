import { useState } from "react";
import AsteriskRed from "@/assets/icons/AsteriskRed";

interface BaseTitleProps {
  question: string
  type: string
  required: boolean
}

const BaseTitle: React.FC<BaseTitleProps> = ({
 question: q,
 type: kind,
 required: mandatory
}) => {
  const [question, setQuestion] = useState(q);
  const [type, setType] = useState(kind);
  const [required, setRequired] = useState(mandatory);

  return (
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
  )
}
export default BaseTitle;
