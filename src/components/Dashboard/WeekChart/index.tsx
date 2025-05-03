"use client";
import { useState, useEffect, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

type WeekChartProps = {
  data: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
  };
};

export default function WeekChart({ data }: WeekChartProps) {
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

  const daysOrder: (keyof WeekChartProps["data"])[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const labels = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const values = daysOrder.map((day) => data[day] || 0);

  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      <BarChart
        xAxis={[{ scaleType: "band", data: labels, label: "Dia da semana" }]}
        series={[
          {
            data: values,
            label: "Encontros",
          },
        ]}
        colors={["#B070F0"]}
        width={containerWidth}
        height={(320 * containerWidth) / 582}
        grid={{ horizontal: true }}
        legend={{ hidden: false }}
      />
    </div>
  );
}
