import { useState } from "react";

import BaseTitle from "../BaseTitle";
import BaseContent from "../BaseContent";
import BaseFooter from "../BaseFooter";
import SquaredDownArrow from "@/assets/icons/SquaredDownArrow";
import SquaredUpArrow from "@/assets/icons/SquaredUpArrow";

interface BaseComponentProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?:  React.ReactNode;
  onMove: (direction: string) => void;
  index: number;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  header,
  content,
  footer,
  index,
  onMove,
}) => {
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col p-[20px] w-[576px] h-fit bg-white rounded-[5px] shadow-md gap-[25px] mb-3.5 relative "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute right-[30px] top-[-5px] flex flex-row items-center gap-2">
          <button onClick={() => onMove("up")}>
            <SquaredUpArrow className="cursor-pointer" />
          </button>
          <button onClick={() => onMove("down")}>
            <SquaredDownArrow className="cursor-pointer" />
          </button>
        </div>
      )}
      {header ? (
        header
      ) : (
        <BaseTitle question={titleValue} onChange={setTitleValue} type="text" />
      )}
      {content ? (
        content
      ) : (
        <BaseContent text={contentValue} onChange={setContentValue} />
      )}
      {footer ? footer : <BaseFooter />}
    </div>
  );
};

export default BaseComponent;
