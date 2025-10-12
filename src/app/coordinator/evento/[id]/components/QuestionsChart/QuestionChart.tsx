"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import * as d3 from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";
import { useState, useEffect, useMemo } from "react";
import WordCloud from "react-d3-cloud";

// Stopwords básicas em português
const STOPWORDS = new Set([
  "de",
  "da",
  "do",
  "dos",
  "das",
  "em",
  "no",
  "na",
  "nos",
  "nas",
  "para",
  "por",
  "com",
  "um",
  "uma",
  "uns",
  "umas",
  "o",
  "a",
  "os",
  "as",
  "que",
  "e",
  "ou",
  "se",
  "ao",
  "à",
  "às",
  "aos",
  "sobre",
  "mais",
  "quem",
  "como",
  "quando",
  "onde",
  "porquê",
  "para",
  "com",
  "sem",
  "foi",
  "era",
]);

type WordData = {
  text: string;
  value: number;
};

type QuestionsChartProps = {
  data: Record<string, number>;
};

// Componente para exibir um loader simples
const LoadingIndicator = ({ text }: { text: string }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      fontFamily: "Poppins, sans-serif",
      color: "#666",
    }}
  >
    <p>{text}</p>
  </div>
);

// Novo componente para renderizar a tabela de frequência
const TableView = ({ data }: { data: WordData[] }) => {
  // Ordena os dados pela frequência (maior para menor)
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead
          style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa" }}
        >
          <tr>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              Palavra
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "right",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              Frequência
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.text} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 10px" }}>{item.text}</td>
              <td
                style={{
                  padding: "8px 10px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function QuestionsChart({ data }: QuestionsChartProps) {
  const [mode, setMode] = useState<"frase" | "palavra" | "tabela">("frase");
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [processedWords, setProcessedWords] = useState<WordData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const chartData = useMemo(() => {
    return Object.keys(data).map((cat) => ({
      category: cat,
      value: data[cat] ?? 0,
    }));
  }, [data]);

  const categories = useMemo(() => Object.keys(data), [data]);
  const colorScale = useMemo(
    () => scaleOrdinal(d3.schemeCategory10).domain(categories),
    [categories]
  );

  useEffect(() => {
    if (categories.length <= 10) return;

    setIsProcessing(true);

    const processData = () => {
      let words: WordData[] = [];
      if (mode === "frase") {
        words = chartData.map((d) => ({
          text: d.category,
          value: d.value,
        }));
      } else {
        // 'palavra' e 'tabela' usam a mesma lógica de processamento
        const wordMap: Record<string, number> = {};
        chartData.forEach((d) => {
          const tokens = d.category
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
            .split(/\s+/)
            .filter((w) => w && !STOPWORDS.has(w));

          tokens.forEach((w) => {
            wordMap[w] = (wordMap[w] ?? 0) + d.value;
          });
        });
        words = Object.entries(wordMap).map(([text, value]) => ({
          text,
          value,
        }));
      }
      setProcessedWords(words);
      setIsProcessing(false);
    };

    const timerId = setTimeout(processData, 50);
    return () => clearTimeout(timerId);
  }, [chartData, categories.length, mode]);

  // Caso muitas categorias: WordCloud ou Tabela
  if (categories.length > 10) {
    return (
      <div
        style={{
          width: "100%",
          height: 400,
          fontFamily: "Poppins, sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setMode("frase")}
            disabled={isProcessing}
            className={mode === "frase" ? "active" : ""}
          >
            Nuvem (Frases)
          </button>
          <button
            onClick={() => setMode("palavra")}
            disabled={isProcessing}
            className={mode === "palavra" ? "active" : ""}
          >
            Nuvem (Palavras)
          </button>
          <button
            onClick={() => setMode("tabela")}
            disabled={isProcessing}
            className={mode === "tabela" ? "active" : ""}
          >
            Tabela
          </button>
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          {isProcessing ? (
            <LoadingIndicator text="Processando dados..." />
          ) : mode === "tabela" ? (
            <TableView data={processedWords} />
          ) : (
            <WordCloud
              data={processedWords}
              font="Poppins"
              height={300}
              fontSize={(word: { value: number }) => Math.sqrt(word.value) * 15}
              spiral="archimedean"
              rotate={() => (Math.random() > 0.7 ? 0 : 90)}
              padding={5}
              fill={(d: { text: string }, i: number) => colorScale(d.text)}
            />
          )}
        </div>
        <style>{`
            button { padding: 6px 12px; border: 1px solid #ccc; background-color: white; cursor: pointer; border-radius: 4px; transition: background-color 0.2s; }
            button:hover { background-color: #f0f0f0; }
            button.active { background-color: #e0e0e0; font-weight: bold; border-color: #aaa; }
            button:disabled { cursor: not-allowed; opacity: 0.6; }
        `}</style>
      </div>
    );
  }

  // Caso poucas categorias: PieChart ou BarChart
  return (
    <div style={{ width: "100%", fontFamily: "Poppins, sans-serif" }}>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => setChartType("pie")}
          className={chartType === "pie" ? "active" : ""}
        >
          Gráfico de Pizza
        </button>
        <button
          onClick={() => setChartType("bar")}
          className={chartType === "bar" ? "active" : ""}
        >
          Gráfico de Barras
        </button>
      </div>

      <div>
        <div style={{ width: "100%", height: 350 }}>
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={false}
                  label={{
                    value: "Categorias",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.category}`}
                      fill={colorScale(entry.category)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={(entry) =>
                    `${(Number(entry.percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.category}`}
                      fill={colorScale(entry.category)}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Quantidade"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {chartType === "bar" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "1.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: colorScale(cat),
                    marginRight: 6,
                    borderRadius: 3,
                  }}
                />
                <span style={{ fontSize: "0.85rem" }}>{cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
            button { padding: 6px 12px; border: 1px solid #ccc; background-color: white; cursor: pointer; border-radius: 4px; transition: background-color 0.2s; }
            button:hover { background-color: #f0f0f0; }
            button.active { background-color: #e0e0e0; font-weight: bold; border-color: #aaa; }
        `}</style>
    </div>
  );
}
