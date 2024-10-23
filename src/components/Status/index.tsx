import React from "react";

interface StatusProps {
  status?: string;
  bgColor?: string;
  color?: string;
}

const Status: React.FC<StatusProps> = ({ status, bgColor, color }) => {
  return (
    <div
      style={{
        backgroundColor: bgColor || "lightblue",
        color: color || "white",
        borderRadius: "100px",
        padding: "2px 10px",
        border: `1px solid ${color || "darkblue"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "fit-content",
      }}
      className="text-sm font-normal font-['Poppins'] leading-[21px]"
    >
      {status}
    </div>
  );
};

export default Status;
