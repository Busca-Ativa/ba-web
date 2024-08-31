import Asterisk from "@/assets/icons/Asterisk";
import AsteriskRed from "@/assets/icons/AsteriskRed";
import Copy from "@/assets/icons/Copy";
import Delete from "@/assets/icons/Delete";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState, ReactNode } from "react";

interface BaseFooterProps {
  left: ReactNode
  onRequire: () => void;
  onCopy: () => void,
  onDelete: () => void,
}

const BaseFooter: React.FC<BaseFooterProps> = ({
 left,
 onRequire,
}) => {

  return (
    <div className="flex justify-between">
      <div className="flex justify-between items-center gap-2 cursor-pointer">
        {left}
      </div>
      <div className="flex justify-between gap-3">
        <button>
          <Copy />
        </button>
        <button onClick={() => onRequire()}>
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
