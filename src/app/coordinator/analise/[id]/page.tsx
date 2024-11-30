"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { ZoomControl, Polygon, Tooltip } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import * as d3 from "d3";
import EventAnalyticsControls from "../components/EventAnalyticsControls";
import Legend from "../components/Legend";
import geojsonData from "../../../data/fortaleza.json";

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
  const geojson: GeoJson = geojsonData as GeoJson;
  const [mapStyle, setMapStyle] = useState("1");
  const [propertie, setPropertie] = useState("");
  const [activePolygon, setActivePolygon] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    setFeatures(Object.keys(geojson.features[0].properties));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => console.error("Erro ao obter localização:", error)
      );
    } else {
      console.error("Geolocalização não suportada pelo navegador.");
    }
  }, []);

  interface GeoJsonFeature {
    type: string;
    geometry: {
      type: string;
      coordinates: LatLngExpression[][];
    };
    properties: {
      [key: string]: any; // Permite acessar qualquer propriedade
    };
  }

  interface GeoJson {
    type: string;
    features: GeoJsonFeature[];
  }

  // Obter a escala para a propriedade selecionada
  const createColorScale = (property: string) => {
    const values = geojson.features.map(
      (feature) => feature.properties[property]
    );
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Criar escala contínua com d3 usando uma única matiz (azul)
    return d3.scaleSequential(d3.interpolateBlues).domain([min, max]);
  };

  const colorScale = propertie ? createColorScale(propertie) : null;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { propriedade, mapa, filtro } = event.target.value as {
      propriedade: string;
      mapa: string;
      filtro: string[];
    };
    setMapStyle(mapa);
    setPropertie(propriedade);
    setFiltro(filtro);
  };

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
          url={
            mapStyle == "1"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png"
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Renderizar os polígonos */}
        {geojson.features
          .filter((feature) =>
            filtro.length > 0
              ? filtro.includes(feature.properties.nome_bairro)
              : true
          )
          .map((feature, index) => (
            <Polygon
              key={index}
              pathOptions={{
                color: colorScale ? "#000000" : "#FF9814", // Cor da borda preta
                fillColor: colorScale
                  ? colorScale(feature.properties[propertie])
                  : "#FF9814",
                opacity: colorScale ? 1 : 1,
                stroke: true,
                fillOpacity: colorScale ? 0.9 : 0.5,
                weight: colorScale ? 1 : 1,
              }}
              positions={feature.geometry.coordinates[0].map((latlng) => {
                const [lng, lat] = latlng as [number, number];
                return [lat, lng];
              })}
              eventHandlers={{
                click: () => {
                  console.log(index);
                  setActivePolygon(index);
                },
              }}
            >
              {propertie && activePolygon === index && (
                <Tooltip permanent>
                  {feature.properties[propertie].toFixed(2)}
                </Tooltip>
              )}
            </Polygon>
          ))}

        <ZoomControl position="topright" />
      </MapContainer>

      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 1000 }}>
        <EventAnalyticsControls data={geojson} handleChange={handleChange} />
      </div>
      <div
        style={{ position: "absolute", bottom: 30, right: 30, zIndex: 1000 }}
      >
        {/* <Legend /> */}
        {colorScale && (
          <div
            style={{
              background: "white",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>Legenda</h4>
            {colorScale.ticks(5).map((tick, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: colorScale(tick),
                    marginRight: "10px",
                  }}
                ></div>
                <span>{tick.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAnalytics;
