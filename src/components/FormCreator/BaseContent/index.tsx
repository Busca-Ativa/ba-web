import { useState } from "react";
import AsteriskRed from "@/assets/icons/AsteriskRed";

interface BaseContentProps {
  type: string
  disabled: boolean
}

const BaseContent: React.FC<BaseContentProps> = ({
 type: kind,
 disabled: usable
}) => {
  const [type, setType] = useState(kind);
  const [disabled, setDisabled] = useState(usable);

  return (
    <input
      className="h-[49px] bg-neutral-100 rounded-sm shadow-inner p-2"
      type={type}
      disabled={disabled}
    />
  )
}
export default BaseContent;
