"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import {
  Breadcrumbs,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { LatLngExpression } from "leaflet";
import { MapOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

// Componentes dinâmicos para evitar SSR no Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function Event({
  params,
}: {
  params: { id: string }; // Pass the param synchronously
}) {
  const { id } = params; // Destructure `id` from params
  const [currentLocation, setCurrentLocation] = useState<LatLngExpression>([
    0, 0,
  ]);

  // Handle geolocation asynchronously inside useEffect
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    } else {
      console.error("Geolocalização não suportada pelo navegador.");
    }
  }, []);

  // Dados fictícios de exemplo
  const eventDetails = {
    title: "Evento #1",
    description: "Descrição detalhada do evento.",
    date: "23 de novembro de 2024",
    attendees: [
      { name: "João", team: "Equipe A", collections: 12 },
      { name: "Maria", team: "Equipe B", collections: 8 },
      { name: "Pedro", team: "Equipe A", collections: 5 },
    ],
  };

  return (
    <Box width={"100%"}>
      {/* Mapa */}
      <Box sx={{ width: "100%", height: 300 }}>
        <MapContainer
          center={currentLocation}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          key={`map-${currentLocation}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </Box>
      <Box sx={{ padding: "40px" }}>
        {/* Breadcrumbs */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box sx={{ padding: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                underline="hover"
                color="inherit"
                href="/coordinator/eventos"
                sx={{
                  height: 21,
                  justifyContent: "start",
                  alignItems: "start",
                  gap: 2.5,
                  display: "inline-flex",
                }}
              >
                <Typography
                  sx={{
                    color: "black",
                    fontSize: "0.875rem", // equivalente a text-sm
                    fontWeight: "normal",
                    fontFamily: "Poppins",
                    lineHeight: "21px",
                  }}
                >
                  Eventos
                </Typography>
              </Link>
              <Typography
                sx={{
                  color: "black",
                  fontSize: "0.875rem", // equivalente a text-sm
                  fontWeight: "normal",
                  fontFamily: "Poppins",
                  lineHeight: "21px",
                }}
              >
                {eventDetails.title}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Button
            sx={{
              height: "41px",
              px: "16px",
              py: "8px",
              backgroundColor: "#19b394",
              borderRadius: "4px",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              display: "inline-flex",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "18px",
              "&:hover": {
                backgroundColor: "#17a188",
              },
            }}
            startIcon={<MapOutlined />}
          >
            Análise em Mapa
          </Button>
        </Box>

        {/* Grupo de informações */}
        <Box
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <Typography
            sx={{
              color: "#0e1113",
              fontSize: "42px",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            {eventDetails.title}
          </Typography>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.875rem", // equivalente a text-sm
              fontWeight: "normal",
              fontFamily: "Poppins",
            }}
          >
            {eventDetails.description}
          </Typography>
          <Typography
            sx={{
              color: "#0e1113",
              fontSize: "0.75rem", // equivalente a text-xs
              fontWeight: "normal",
              fontFamily: "Poppins",
            }}
          >
            <strong>Data:</strong> {eventDetails.date}
          </Typography>
        </Box>
        {/* Meta */}
        <Box
          sx={{
            padding: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography
            sx={{
              color: "#0e1113",
              fontSize: "22px",
              fontWeight: "bold",
              fontFamily: "Poppins",
            }}
          >
            Meta
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "20px",
                backgroundColor: "#d9d9d9",
                borderRadius: "0",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "10%",
                  height: "100%",
                  backgroundColor: "#ee8d10",
                  borderRadius: "0",
                }}
              />
            </Box>
            <Typography
              sx={{
                color: "#0e1113",
                fontSize: "0.875rem",
                fontWeight: "normal",
                fontFamily: "Poppins",
                lineHeight: "21px",
              }}
            >
              100/100
            </Typography>
          </Box>
        </Box>

        {/* Tabela */}
        <Box sx={{ padding: 2 }}>
          <Typography
            sx={{
              color: "#0e1113",
              fontSize: "22px",
              fontWeight: "bold",
              fontFamily: "Poppins",
              marginBottom: "8px",
            }}
          >
            Agentes
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 0, // Remove bordas arredondadas
              boxShadow: "none",
            }}
          >
            <Table sx={{ fontFamily: "Poppins" }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f0f3f8", // Cor de fundo para o cabeçalho
                  }}
                >
                  <TableCell>
                    <strong>Nome</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Coletas</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventDetails.attendees.map((attendee, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f0f3f8", // Alterna entre as cores
                    }}
                  >
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.team}</TableCell>
                    <TableCell>{attendee.collections}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
