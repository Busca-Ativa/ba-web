import Asterisk from "@/assets/icons/Asterisk";
import AsteriskRed from "@/assets/icons/AsteriskRed";
import Copy from "@/assets/icons/Copy";
import Delete from "@/assets/icons/Delete";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { duplicateElement, removeElement } from "../../../../redux/surveySlice";

interface BaseFooterProps {
  left?: ReactNode;
  pageIndex?: number;
  elementIndex?: number;
  onRequire?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

const BaseFooter: React.FC<BaseFooterProps> = ({
  left,
  onRequire = () => {},
  onCopy = () => {},
  onDelete = () => {},
  pageIndex,
  elementIndex,
}) => {
  const dispatch = useDispatch();

  const handleDuplicate = () => {
    dispatch(duplicateElement({ pageIndex, elementIndex }));
  };

  const handleDelete = () => {
    dispatch(removeElement({ pageIndex, elementIndex }));
  };

  return (
    <div className="flex justify-between">
      <div className="flex justify-between items-center gap-2 cursor-pointer">
        {left}
      </div>
      <div className="flex justify-between gap-3">
        <button onClick={() => handleDuplicate()}>
          <Copy />
        </button>
        <button onClick={() => onRequire()}>
          <Asterisk />
        </button>
        <button onClick={() => handleDelete()}>
          <Delete />
        </button>
      </div>
    </div>
  );
};
export default BaseFooter;
