import { useState } from "react";

import BaseTitle from "../BaseTitle"
import BaseContent from "../BaseContent"
import BaseFooter from "../BaseFooter"

interface BaseComponentProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  footer?:  React.ReactNode;
  onMove: (to: number,from: number) => void;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  title = <BaseTitle/>,
  content = <BaseContent/>,
  footer = <BaseFooter/>,
  onMove
}) => {

  return (
    <div className="flex flex-col p-[20px] w-[576px] h-[228px] bg-white rounded-[5px] shadow-md gap-[25px] mb-3.5">
      {title}
      {content}
      {footer}
      {/* <BaseTitle question={question} type={type} required={required}/> */}
      {/* <BaseContent/> */}
      {/* <BaseFooter/> */}
    </div>
  );
};

export default BaseComponent;
