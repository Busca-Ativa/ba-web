"use client";
import { LineChart } from "@mui/x-charts/LineChart";
import { useEffect, useRef, useState } from "react";

export default function MonthChart() {
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

  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            curve: "linear",
            showMark: true,
          },
        ]}
        colors={["#FFBC66"]}
        sx={{ height: 300 }}
        width={containerWidth}
        height={(320 * containerWidth) / 582}
        grid={{ horizontal: true }}
      />
    </div>
  );
}
