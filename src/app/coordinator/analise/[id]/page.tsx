"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { ZoomControl, Marker, Popup, Polygon } from "react-leaflet";
import { Box } from "@mui/material";
import EventAnalyticsControls from "../components/EventAnalyticsControls";
import { LatLngExpression } from "leaflet";

// Importação dinâmica para evitar SSR no Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const EventAnalytics = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    0, 0,
  ]);

  // Obtendo a localização atual do usuário
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

  // Exemplo de polígono
  const polygonLatLngs = [
    [51.51, -0.1],
    [51.52, -0.1],
    [51.52, -0.09],
    [51.51, -0.09],
  ];

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        margin: 0,
        position: "relative",
      }}
    >
      <MapContainer
        center={currentLocation}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        key={`map-${currentLocation}`}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Adicionando marcador */}
        <Marker position={currentLocation}>
          <Popup>Você está aqui!</Popup>
        </Marker>

        {/* Adicionando polígono */}
        <Polygon
          positions={[polygonLatLngs] as LatLngExpression[][]}
          color="blue"
        >
          <Popup>Polígono de exemplo</Popup>
        </Polygon>

        <ZoomControl position="topright" />
      </MapContainer>

      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 1000 }}>
        <EventAnalyticsControls />
      </div>
    </div>
  );
};

export default EventAnalytics;
