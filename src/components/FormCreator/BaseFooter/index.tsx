import Asterisk from "@/assets/icons/Asterisk";
import AsteriskRed from "@/assets/icons/AsteriskRed";
import Copy from "@/assets/icons/Copy";
import Delete from "@/assets/icons/Delete";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState } from "react";

interface BaseFooterProps {
  left: any
  onRequire: (value) => void;
  onCopy: () => void,
  onDelete: () => void,
}

const BaseFooter: React.FC<BaseFooterProps> = ({
 left,
 onRequire,
}) => {
  const [dropOpen, setDropOpen] = useState(false);

  return (
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
        <button onClick={() => onRequire(!required)}>
          <Asterisk />
        </button>
        <button>
          <Delete />
        </button>
      </div>
    </div>
  )
}
export default BaseFooter;
