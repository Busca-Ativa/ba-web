"use client";

import { useEffect, useState } from "react";
import "./style.css";

type CardProps = {
  bgColor: string;
  textColor: string;
  title: string;
  content: string;
};

const Card = ({ bgColor, textColor, title, content }: CardProps) => {
  const [style, setStyle] = useState({});

  useEffect(() => {
    setStyle({
      backgroundColor: `var(${bgColor})`,
      color: `var(${textColor})`,
      gap: "5px",
      padding: "20px",
    });
  }, [bgColor, textColor]);

  return (
    <div style={style} className="Card">
      <span className="text-md 2xl:text-xl">{title}</span>
      <p className="text-xl 2xl:text-2xl">{content}</p>
    </div>
  );
};

export default Card;
