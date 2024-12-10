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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mock from "../../../data/responses-mock.json";
import mock2 from "../../../data/responses-mock2.json";
import mock3 from "../../../data/responses-mock3.json";

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

  const [quantileScale, setQuantileScale] = useState<any>(null);
  const [colorScale, setColorScale] = useState<any>(null);
  const [quantileValues, setQuantileValues] = useState<number[]>([]);

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
              map_refs:
                filtro.length > 0
                  ? event.full_geometry_ref.filter((geometry: any) =>
                      filtro.includes(geometry.ref)
                    )
                  : event.full_geometry_ref,
            }
          );
          // setResponseType(mock3.type as any);
          // setResponses(mock3.responses_by_segments);
          setResponseType(response.data.type);
          setResponses(response.data.responses_by_segments);
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      }
    };

    fetchAnalysis();
  }, [event, filtro, propertie]);

  useEffect(() => {
    if (wordCloud.length > 0) {
      const scale = createColorScale(wordCloud);
      setColorScale(() => scale);
    }
  }, [wordCloud]);

  useEffect(() => {
    console.log(filtro);
  }, [filtro]);

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
      console.log(wordCountByResponse);
      setWordCloud(wordCountByResponse);
    }
    if (responseType === "categorical") {
      const wordCountByResponse = responses.map((response) => {
        const wordMap: { [key: string]: number } = {};

        // Achatar respostas (individualizar itens dentro de arrays)
        response.responses.flat().forEach((word: string) => {
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

      console.log(wordCountByResponse);
      setWordCloud(wordCountByResponse);
    }

    if (responseType === "numerical") {
      // Extrair todos os valores numéricos de todas as respostas
      const allValues = responses.flatMap((segment: any) => segment.responses);

      // Criar uma escala quantílica com 5 grupos (quintis)
      const quantile = d3.scaleQuantile().domain(allValues).range(d3.range(5));

      // Gerar os valores dos limites dos quintis
      const quantiles = quantile.quantiles();

      // Criar uma escala de cores correspondente
      const colorScale = d3
        .scaleOrdinal()
        .domain(d3.range(5).map(String))
        .range(d3.schemeBlues[5]); // Pode usar outras esquemas como d3.schemeViridis

      // Atualizar os estados
      setQuantileScale(() => quantile);
      setQuantileValues(() => quantiles);
      setColorScale(() => colorScale);
    }
  }, [responseType, responses]);

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

  const createColorScale = (wordCloud: any) => {
    const allWords = wordCloud.flatMap((segment: any) =>
      segment.wordCount.map((word: any) => word.text)
    );
    const uniqueWords = Array.from(new Set(allWords));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueWords);
    return colorScale;
  };

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
        {geojson.features.map((feature, index) => {
          if (
            filtro.length > 0 &&
            !filtro.includes(feature.properties.CD_SETOR)
          ) {
            return null;
          }
          return (
            <Polygon
              key={index}
              pathOptions={{
                color:
                  activePolygon == index
                    ? "black"
                    : responses && colorScale
                    ? colorScale(
                        responses.find(
                          (x) => x.id_segmento == feature.properties.CD_SETOR
                        )?.mean ||
                          responses.find(
                            (x) => x.id_segmento == feature.properties.CD_SETOR
                          )?.mode
                      )
                    : "#FF6844",
                fillColor:
                  responses && colorScale
                    ? colorScale(
                        responses.find(
                          (x) => x.id_segmento == feature.properties.CD_SETOR
                        )?.mode
                      )
                    : "#FF9814",
                opacity: 1,
                stroke: true,
                fillOpacity: 0.5,
                weight: activePolygon == index ? 2 : 1,
              }}
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
              {responseType != "numerical" &&
                activePolygon == index &&
                wordCloud.find(
                  (x) => x.id_segmento == feature.properties?.CD_SETOR
                ) && (
                  <div
                    className="word-table"
                    style={{
                      position: "absolute",
                      top: `${clickPosition.y - 150}px`,
                      left: `${clickPosition.x}px`,
                      backgroundColor: "white",
                      zIndex: 1000,
                      padding: "20px",
                      borderRadius: "5px",
                      width: "400px",
                      maxHeight: "300px",
                      overflow: "auto",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h4
                        style={{ margin: 0 }}
                        className="text-[#0e1113] text-lg font-bold font-['Poppins'] leading-[38px]"
                      >
                        Respostas
                      </h4>
                      <button
                        style={{
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
                    </div>
                    <h5 className="text-[#0e1113] text-[12px] font-medium font-['Poppins'] leading-[38px]">
                      Setor: {feature.properties?.CD_SETOR}
                    </h5>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "8px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "left",
                              backgroundColor: "#f0f3f8",
                            }}
                          >
                            Resposta
                          </th>
                          <th
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "8px",
                              backgroundColor: "#f0f3f8",
                              textAlign: "left",
                            }}
                          >
                            Qtd
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {wordCloud
                          .find(
                            (x) => x.id_segmento == feature.properties?.CD_SETOR
                          )
                          ?.wordCount.map((word, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#FFF" : "#f0f3f8",
                              }}
                            >
                              <td
                                style={{
                                  padding: "8px",
                                }}
                              >
                                {word.text}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                }}
                              >
                                {word.value}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {responseType === "numerical" &&
                activePolygon === index &&
                responses.find(
                  (x) => x.id_segmento === feature.properties?.CD_SETOR
                ) && (
                  <div
                    className="numerical-table"
                    style={{
                      position: "absolute",
                      top: `${clickPosition.y - 150}px`,
                      left: `${clickPosition.x}px`,
                      backgroundColor: "white",
                      zIndex: 1000,
                      padding: "20px",
                      borderRadius: "5px",
                      width: "400px",
                      maxHeight: "350px",
                      overflow: "auto",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h4
                        style={{ margin: 0 }}
                        className="text-[#0e1113] text-lg font-bold font-['Poppins'] leading-[38px]"
                      >
                        Estatísticas Numéricas
                      </h4>
                      <button
                        style={{
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
                    </div>
                    <h5 className="text-[#0e1113] text-[12px] font-medium font-['Poppins'] leading-[38px]">
                      Setor: {feature.properties?.CD_SETOR}
                    </h5>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "8px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "8px",
                              textAlign: "left",
                              backgroundColor: "#f0f3f8",
                            }}
                          >
                            Métrica
                          </th>
                          <th
                            style={{
                              borderBottom: "1px solid #ddd",
                              padding: "8px",
                              backgroundColor: "#f0f3f8",
                              textAlign: "left",
                            }}
                          >
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const segment = responses.find(
                            (x) =>
                              x.id_segmento === feature.properties?.CD_SETOR
                          );
                          if (!segment) return null;

                          const values = segment.responses;
                          const count = values.length;
                          const mean = d3.mean(values);
                          const meanValue =
                            mean !== undefined ? mean.toFixed(2) : "N/A";
                          const mode = d3.mode(values);
                          const max = Math.max(...values);
                          const min = Math.min(...values);

                          const metrics = [
                            { label: "Soma", value: count },
                            {
                              label: "Média",
                              value:
                                mean !== undefined ? mean.toFixed(2) : "N/A",
                            },
                            {
                              label: "Moda",
                              value: mode !== undefined ? mode : "N/A",
                            },
                            { label: "Máximo", value: max },
                            { label: "Mínimo", value: min },
                          ];

                          return metrics.map((metric, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#FFF" : "#f0f3f8",
                              }}
                            >
                              <td
                                style={{
                                  padding: "8px",
                                }}
                              >
                                {metric.label}
                              </td>
                              <td
                                style={{
                                  padding: "8px",
                                }}
                              >
                                {metric.value}
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
            </Polygon>
          );
        })}

        <ZoomControl position="topright" />
      </MapContainer>

      <div style={{ position: "absolute", top: 30, left: 30, zIndex: 1000 }}>
        <EventAnalyticsControls
          questions={questions}
          data={data}
          event={event}
          handleChange={handleChange}
        />
      </div>
      <div
        style={{ position: "absolute", bottom: 30, right: 30, zIndex: 1000 }}
      >
        {/* <Legend /> */}
        {wordCloud.length > 0 && (
          <div
            style={{
              minWidth: "200px",
              background: "white",
              borderRadius: "5px",
              padding: "20px",
            }}
          >
            <h4 className="mb-4">Legenda</h4>
            {Array.from(
              new Set(
                wordCloud.flatMap((segment) =>
                  segment.wordCount.map((word) => word.text)
                )
              )
            ).map((word, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: colorScale ? colorScale(word) : "#ccc",
                    marginRight: "10px",
                  }}
                ></div>
                <span>{word}</span>
              </div>
            ))}
          </div>
        )}

        {responseType === "numerical" && (
          <div
            style={{
              minWidth: "200px",
              background: "white",
              borderRadius: "5px",
              padding: "20px",
            }}
          >
            <h4 className="mb-4">Legenda</h4>
            {quantileValues.map((threshold: number, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: colorScale ? colorScale(i) : "#ccc",
                    marginRight: "10px",
                  }}
                ></div>
                <span>
                  {i === 0
                    ? `<= ${threshold.toFixed(2)}`
                    : i === quantileValues.length
                    ? `> ${quantileValues[i - 1].toFixed(2)}`
                    : `${quantileValues[i - 1].toFixed(
                        2
                      )} - ${threshold.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventAnalytics;
