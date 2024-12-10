"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ZoomControl, Polygon, Tooltip, useMap } from "react-leaflet";
import { LatLngBounds, LatLngExpression, map } from "leaflet";
import * as d3 from "d3";
import EventAnalyticsControls from "../components/EventAnalyticsControls";
import Legend from "../components/Legend";
import geojsonData from "../../../data/fortaleza.json";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import FitBoundsComponent from "../components/FitBoundsMap";
import ReactWordcloud from "react-wordcloud";
import { Close } from "@mui/icons-material";

// Importação dinâmica para evitar SSR no Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const EventAnalytics = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const { id } = params;
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([
    0, 0,
  ]);
  const data: GeoJson = geojsonData as GeoJson;
  const [mapStyle, setMapStyle] = useState("1");
  const [propertie, setPropertie] = useState("");
  const [activePolygon, setActivePolygon] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const [event, setEvent] = useState<any>(null);
  const [geojson, setGeojson] = useState<GeoJson>({
    type: "FeatureCollection",
    features: [],
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [responseType, setResponseType] = useState();
  const [wordCloud, setWordCloud] = useState<any[]>([]);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // setFeatures(Object.keys(geojson.features[0].properties));

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

  useEffect(() => {
    api
      .get(`/coordinator/institution/event/${id}`)
      .then((response) => {
        setEvent(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const loadSegments = async (id_segment: any, type_segment: any) => {
    try {
      const response = await api.get(
        `/all/geojson?id_segment=${id_segment}&segment_type=${type_segment}`
      );

      if (response.status === 200) {
        setGeojson((prev) => ({
          ...prev,
          features: [...prev.features, ...response.data.features],
        }));
        return;
      }
    } catch (error) {
      console.error("Erro ao carregar Agentes:", error);
    }
  };

  useEffect(() => {
    if (event) {
      event.full_geometry_ref.forEach((segment: any) => {
        loadSegments(segment.ref, segment.type);
      });

      api
        .get(`coordinator/institution/form/${event.id_form}`)
        .then((response) => {
          const form = response.data.data;
          const questions_aux: SetStateAction<any[]> = [];
          form.survey_schema.pages[0].elements.map(
            (question: any, index: number) => {
              questions_aux.push(question);
            }
          );
          setQuestions(questions_aux);
        });
    }
  }, [event]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (propertie) {
        try {
          const response = await api.post(
            `coordinator/map/analysis?question=${
              propertie?.name || propertie?.title
            }`,
            {
              id_event: event.id,
              id_form: event.id_form,
              map_refs: event.full_geometry_ref,
            }
          );
          setResponseType(response.data.type);
          setResponses(response.data.responses_by_segments);
        } catch (error) {
          console.error("Erro ao obter análise do mapa:", error);
        }
      }
    };

    fetchAnalysis();
  }, [event, propertie]);

  useEffect(() => {
    if (responseType === "text") {
      const wordCountByResponse = responses.map((response) => {
        const wordMap: { [key: string]: number } = {};
        response.responses.forEach((word: string) => {
          if (wordMap[word]) {
            wordMap[word]++;
          } else {
            wordMap[word] = 1;
          }
        });
        return {
          id_segmento: response.id_segmento,
          wordCount: Object.keys(wordMap).map((word) => ({
            text: word,
            value: wordMap[word],
          })),
        };
      });

      setWordCloud(wordCountByResponse);
    }
  }, [responseType, responses]);

  useEffect(() => {
    console.log(geojson);
  }, [geojson]);

  interface GeoJsonFeature {
    features: any;
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

  const handleMapLoad = (mapInstance: any) => {
    console.log("Map loaded:", mapInstance);
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
        <FitBoundsComponent geojson={geojson} />

        {/* Renderizar os polígonos */}
        {geojson.features.map((feature, index) => (
          <Polygon
            key={index}
            // pathOptions={{
            //   color: colorScale ? "#000000" : "#FF9814", // Cor da borda preta
            //   fillColor: colorScale
            //     ? colorScale(feature.properties[propertie])
            //     : "#FF9814",
            //   opacity: colorScale ? 1 : 1,
            //   stroke: true,
            //   fillOpacity: colorScale ? 0.9 : 0.5,
            //   weight: colorScale ? 1 : 1,
            // }}
            positions={feature?.geometry?.coordinates[0].map(
              (latlng: LatLngExpression) => {
                const [lng, lat] = latlng as [number, number];
                return [lat, lng];
              }
            )}
            eventHandlers={{
              click: (e) => {
                setActivePolygon(index);
                setClickPosition({
                  x: e.containerPoint.x,
                  y: e.containerPoint.y,
                });
                console.log(
                  wordCloud.find(
                    (x) => x.id_segmento == feature.properties?.CD_SETOR
                  )?.wordCount
                );
              },
            }}
          >
            {responseType == "text" &&
              propertie &&
              activePolygon == index &&
              wordCloud.find(
                (x) => x.id_segmento == feature.properties?.CD_SETOR
              ) && (
                <div
                  className="word-cloud"
                  style={{
                    position: "absolute",
                    top: `${clickPosition.y - 150}px`,
                    left: `${clickPosition.x}px`,
                    backgroundColor: "white",
                    zIndex: 1000,
                    padding: "10px",
                    borderRadius: "5px",
                    width: "225px",
                    height: "150px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "grey",
                    }}
                    onClick={() => {
                      setActivePolygon(null);
                      setClickPosition({ x: 0, y: 0 });
                    }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      <Close />
                    </span>
                  </button>
                  <ReactWordcloud
                    words={
                      wordCloud.find(
                        (x) => x.id_segmento == feature.properties?.CD_SETOR
                      )?.wordCount
                    }
                    options={{
                      fontSizes: [10, 60],
                      padding: 1,
                      rotations: 2,
                      rotationAngles: [-90, 0],
                      scale: "sqrt",
                      spiral: "archimedean",
                      transitionDuration: 1000,
                    }}
                  />
                </div>
              )}

            {/* {propertie && activePolygon === index && (
                <Tooltip permanent>
                {feature.properties[propertie].toFixed(2)}
                </Tooltip>
              )}} */}
          </Polygon>
        ))}

        <ZoomControl position="topright" />
      </MapContainer>

      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 1000 }}>
        <EventAnalyticsControls
          questions={questions}
          data={data}
          handleChange={handleChange}
        />
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
