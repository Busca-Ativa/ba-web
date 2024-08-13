"use client";
import { useEffect, useState } from "react";
import "./style.css";

type LegendProps = {
  colors: string[];
  values: string[];
};

const Legend = ({ colors, values }: LegendProps) => {
  const [styles, setStyles] = useState<{ backgroundColor: string }[]>([]);

  useEffect(() => {
    const styleColors = colors.map((color) => ({
      backgroundColor: `${color}`,
    }));

    setStyles(styleColors);
  }, [colors]);

  return (
    <div className="legend">
      {values.map((value, index) => (
        <div className="legend-item" key={index}>
          <span style={styles[index]} className="w-[5px] h-[5px]"></span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
