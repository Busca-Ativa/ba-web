"use client";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";

interface DailyCollection {
  date: string;
  count: number;
}

interface Summary {
  collection_flow?: {
    daily_collections?: DailyCollection[];
    filters?: {
      agent_id?: string | null;
      city?: string | null;
      unit_id?: string | null;
    };
  };
}

interface FlowChartProps {
  summary: Summary;
  cities?: string[];
  units?: string[];
  agents?: string[];
  setPayload: (payload: {
    city?: string;
    unit?: string;
    agent?: string;
  }) => void;
}

const FlowChart = ({
  summary,
  cities = [],
  units = [],
  agents = [],
  setPayload,
}: FlowChartProps) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");

  // Dispara setPayload sempre que algum filtro mudar
  useEffect(() => {
    setPayload({
      city: selectedCity || undefined,
      unit: selectedUnit || undefined,
      agent: selectedAgent || undefined,
    });
  }, [selectedCity, selectedUnit, selectedAgent, setPayload]);

  // Extrair daily_collections
  const dailyCollections = summary?.collection_flow?.daily_collections || [];

  // Mapear para o formato esperado pelo Recharts
  const chartData = dailyCollections.map((d: any) => {
    const [year, month, day] = d.date.split("-");
    return {
      date: `${day}/${month}/${year}`,
      count: d.count,
    };
  });

  return (
    <Box flex={1} mr={2}>
      <Typography
        sx={{
          color: "#0e1113",
          fontSize: "1.25rem",
          fontWeight: "bold",
          fontFamily: "Poppins",
          lineHeight: "2",
          marginBottom: 2,
        }}
      >
        Fluxo de Coletas
      </Typography>

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Cidade</InputLabel>
          <Select
            value={selectedCity}
            label="Cidade"
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Unidade</InputLabel>
          <Select
            value={selectedUnit}
            label="Unidade"
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Agente</InputLabel>
          <Select
            value={selectedAgent}
            label="Agente"
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {agents.map((agent) => (
              <MenuItem key={agent} value={agent}>
                {agent}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {chartData.length > 0 ? (
        <Box sx={{ width: "100%", height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                label={{ value: "Coletas", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Typography sx={{ color: "#888", fontSize: "0.9rem" }}>
          Nenhuma coleta disponível
        </Typography>
      )}
    </Box>
  );
};

export default FlowChart;
