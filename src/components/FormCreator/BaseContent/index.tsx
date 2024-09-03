import { useState } from "react";
import AsteriskRed from "@/assets/icons/AsteriskRed";

interface BaseContentProps {
  text: string
  type: string
  disabled: boolean
  onChange: (value: string) => void
}

const BaseContent: React.FC<BaseContentProps> = ({
  text,
  type,
  disabled,
  onChange
}) => {

  return (
    <input
      className="h-[49px] bg-neutral-100 rounded-sm shadow-inner p-2"
      type={type}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  )
}
export default BaseContent;
