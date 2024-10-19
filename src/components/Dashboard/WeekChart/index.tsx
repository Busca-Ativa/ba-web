"use client";
import { useState, useEffect, useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

export default function WeekChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.offsetWidth);
      }
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      <BarChart
        xAxis={[{ scaleType: "band", data: ["Contagem"] }]}
        series={[
          { data: [40] },
          { data: [30] },
          { data: [50] },
          { data: [20] },
          { data: [60] },
          { data: [10] },
          { data: [100] },
        ]}
        colors={[
          "#B070F0",
          "#EF4838",
          "#62ACED",
          "#F99C34",
          "#B3E6F5",
          "#40C156",
          "#CDA6FF",
        ]}
        sx={{ height: 300 }}
        width={containerWidth}
        height={(320 * containerWidth) / 582}
        grid={{ horizontal: true }}
      />
    </div>
  );
}
