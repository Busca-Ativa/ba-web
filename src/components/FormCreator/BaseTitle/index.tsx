import { useState, useEffect, SetStateAction, Dispatch } from "react";
import AsteriskRed from "@/assets/icons/AsteriskRed";

interface BaseTitleProps {
  question: string;
  type: string;
  required: boolean;
  onChange: Dispatch<SetStateAction<string>>
}

const BaseTitle: React.FC<BaseTitleProps> = ({
 question,
 type,
 required,
 onChange,
}) => {


  return (
    <div className="flex justify-between items-center gap-4">
      <input
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite a pergunta"
        type={type}
        className="flex-1 text-[#0f1113] text-lg font-semibold font-['Poppins'] leading-[21px] mt-[15px] rounded border-2 border-transparent hover:border-[#575757]"
      />
      {required && <AsteriskRed />}
    </div>
  )
}
export default BaseTitle;
