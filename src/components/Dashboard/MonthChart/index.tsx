"use client";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useRef, useState } from "react";

type MonthChartProps = {
  data: Record<string, number>; // Exemplo: { "1": 3, "2": 6, ... }
};

export default function MonthChart({ data }: MonthChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth);
      }
    };

    updateWidth();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateWidth);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", updateWidth);
      }
    };
  }, []);

  const days = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  const sales = days.map((day) => data[String(day)]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      <LineChart
        xAxis={[{ data: days, label: "Dia do Mês" }]}
        series={[
          {
            data: sales,
            label: "Vendas",
            curve: "linear",
            showMark: true,
          },
        ]}
        colors={["#FFBC66"]}
        width={containerWidth}
        height={(320 * containerWidth) / 582}
        grid={{ horizontal: true }}
        legend={{ hidden: false }} // Mostra legenda
      />
    </div>
  );
}
