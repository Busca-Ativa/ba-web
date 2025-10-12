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
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { Polygon } from "react-leaflet";
import { MapOutlined } from "@mui/icons-material";
import Card from "@/components/Dashboard/Card";
import QuestionChart from "./components/QuestionsChart";
import FlowChart from "./components/FlowChart";

// Componentes dinâmicos para evitar SSR no Leaflet
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   {
//     ssr: false,
//   }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );

export default function Event({
  params,
}: {
  params: { id: string }; // Pass the param synchronously
}) {
  const { id } = params; // Destructure `id` from params
  // const mapRef = useRef<any>(null); // Referência para o mapa
  // const [currentLocation, setCurrentLocation] = useState<[number, number]>([
  //   0, 0,
  // ]);
  const [event, setEvent] = useState<any>({});
  const [formattedDateRange, setFormattedDateRange] = useState<string>("");
  const router = useRouter();
  // const [geojsons, setGeojsons] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [cards, setCards] = useState<any[]>([]);
  const [summaryPayloads, setSummaryPayloads] = useState<string>("");
  const [agents, setAgents] = useState<any[]>([]);
  const [formReference, setFormReference] = useState<any>(null);

  const handlePayload = (payload: {
    city?: string;
    unit?: string;
    agent?: string;
  }) => {
    // Monta a string de query a partir do payload
    const queryString = Object.entries(payload)
      .filter(([_, value]) => value)
      .map(([key, value]) => `&${key}=${encodeURIComponent(value as string)}`)
      .join("");
    setSummaryPayloads(queryString);
  };

  // Handle geolocation asynchronously inside useEffect
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setCurrentLocation([latitude, longitude]);
  //       },
  //       (error) => {
  //         console.error("Erro ao obter localização:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocalização não suportada pelo navegador.");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (geojsons.length > 0) {
  //     const bounds = geojsons.reduce((acc: any, geo: any) => {
  //       if (geo.features) {
  //         geo.features.forEach((feature: any) => {
  //           const polygonBounds = feature.geometry.coordinates.map(
  //             (polygon: any) =>
  //               polygon
  //                 .filter(
  //                   (coordinate: any) =>
  //                     typeof coordinate[0] === "number" &&
  //                     typeof coordinate[1] === "number"
  //                 )
  //                 .map((coordinate: any) => [coordinate[1], coordinate[0]])
  //           );
  //           acc?.extend(polygonBounds.flat());
  //         });
  //       } else {
  //         const polygonBounds = geo.geometry.coordinates.map((polygon: any) =>
  //           polygon.map((coordinate: any) => [coordinate[1], coordinate[0]])
  //         );
  //         acc?.extend(polygonBounds.flat());
  //       }
  //       return acc;
  //     }, new L.LatLngBounds([]));

  //     // Ajusta o mapa para que as geometrias estejam completamente visíveis
  //     mapRef?.current?.fitBounds(bounds);

  //     // Calcula o centro e atualiza o estado
  //     let center: L.LatLng | undefined;
  //     if (
  //       bounds &&
  //       typeof bounds.getCenter === "function" &&
  //       bounds.isValid()
  //     ) {
  //       center = bounds.getCenter();
  //       if (
  //         center &&
  //         typeof center.lat === "number" &&
  //         typeof center.lng === "number"
  //       ) {
  //         setCurrentLocation([center.lat, center.lng]);
  //       }
  //     }
  //   }
  // }, [geojsons]);

  useEffect(() => {
    api
      .get(`/coordinator/institution/event/${id}`)
      .then((response) => {
        setEvent(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });

    api
      .get(`/coordinator/event/summary${summaryPayloads}`, {
        params: {
          id: id,
        },
      })
      .then((response) => {
        setSummary(response.data);
      });
  }, [id]);

  useEffect(() => {
    if (event && event.agents) {
      const mappedAgents = event.agents.map((agent: any) => ({
        name: agent.name,
        team: agent.team || "-",
        unit: agent.unit.name,
      }));
      setAgents(mappedAgents);
    }

    if (event && event.teams) {
      // Buscar times
      api.get(`/coordinator/institution/teams`).then((response) => {
        const mappedTeams = event.teams.map((team: any) => {
          const teamData = response.data.data.find(
            (teamData: any) => teamData.id == team.id
          );
          return teamData;
        });

        // Buscar unidades
        api.get(`/coordinator/institution/units`).then((unitResponse) => {
          const units = unitResponse.data.data;

          // Atualizar informações dos times com o nome da unidade
          const teamsWithUnits = mappedTeams.map((team: any) => {
            const unit = units.find((unit: any) => unit.id === team.id_unit);
            return {
              ...team,
              unitName: unit ? unit.name : "Unidade não encontrada",
            };
          });

          // Atualizar informações dos agentes com o nome da unidade
          const agentsWithUnits = teamsWithUnits.flatMap((team: any) =>
            team.agents.map((agent: any) => ({
              name: agent.name,
              team: team.name,
              unit: team.unitName,
            }))
          );

          setAgents((prev) => [...prev, ...agentsWithUnits]);

          const uniqueAgents = new Set<string>();
          agentsWithUnits.forEach((agent: any) => {
            uniqueAgents.add(JSON.stringify(agent));
          });
          const uniqueAgentsArray = Array.from(uniqueAgents).map((agent) => {
            const parsedAgent = JSON.parse(agent);
            return parsedAgent;
          });
          setAgents([...agents, ...uniqueAgentsArray]);
        });
      });
    }

    if (event.id_form) {
      api
        .get(`/coordinator/institution/form/${event.id_form}`)
        .then((response) => {
          setFormReference(response.data.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  // useEffect(() => {
  //   if (event && event.full_geometry_ref) {
  //     const fetchGeojsons = async () => {
  //       try {
  //         const requests = event.full_geometry_ref.map((geometry: any) =>
  //           api.get(
  //             `/all/geojson?segment_type=${geometry.type}&id_segment=${geometry.ref}`
  //           )
  //         );

  //         const responses = await Promise.all(requests);
  //         const geojsonData = responses.map((res) => res.data);
  //         setGeojsons(geojsonData);
  //       } catch (error) {
  //         console.error("Erro ao buscar geojsons:", error);
  //       }
  //     };

  //     fetchGeojsons();
  //   }
  // }, [event]);

  useEffect(() => {
    const unitCount = summary?.summary?.unit_count;
    const agentCount = summary?.summary?.agent_count;
    const bestUnit = summary?.summary?.unit_with_most_collections;
    const bestAgent = summary?.summary?.agent_with_most_collections;

    setCards([
      {
        key: 1,
        title: "Quant. Unidades",
        content: unitCount === 1 ? "1 unidade" : `${unitCount} unidades`,
        bgColor: "--primary-lighter",
        textColor: "--primary-dark",
      },
      {
        key: 2,
        title: "Quant. Agentes",
        content: agentCount === 1 ? "1 agente" : `${agentCount} agentes`,
        bgColor: "--secondary-lighter",
        textColor: "--secondary-dark",
      },
      {
        key: 3,
        title: "Unidade com mais Coletas",
        content: bestUnit ? bestUnit.name : "-",
        bgColor: "--primary-lighter",
        textColor: "--primary-dark",
      },
      {
        key: 4,
        title: "Agente com mais Coletas",
        content: bestAgent ? bestAgent.name : "-",
        bgColor: "--secondary-lighter",
        textColor: "--secondary-dark",
      },
    ]);
  }, [summary]);

  return (
    <Box width={"100%"}>
      {/* Mapa */}
      <Box sx={{ width: "100%", height: 300 }}>
        {/*{currentLocation[0] !== 0 && geojsons.length > 0 && (
          <MapContainer
            center={currentLocation}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {geojsons.map((geo, geoIndex) =>
              geo.features ? (
                geo.features.map(
                  (
                    feature: { geometry: { coordinates: any[] } },
                    featureIndex: any
                  ) => (
                    <Polygon
                      key={`${geoIndex}-${featureIndex}`}
                      positions={feature.geometry.coordinates.map((polygon) =>
                        polygon.map((coordinate: any[]) => [
                          coordinate[1],
                          coordinate[0],
                        ])
                      )}
                    />
                  )
                )
              ) : (
                <Polygon
                  key={geoIndex}
                  positions={geo.geometry.coordinates.map((polygon: any[]) =>
                    polygon.map((coordinate: any[]) => [
                      coordinate[1],
                      coordinate[0],
                    ])
                  )}
                />
              )
            )}
          </MapContainer>
        )}*/}
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
                    fontSize: "0.875rem",
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
                  fontSize: "0.875rem",
                  fontWeight: "normal",
                  fontFamily: "Poppins",
                  lineHeight: "21px",
                }}
              >
                {event?.name}
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
            onClick={() => {
              router.push(`/coordinator/analise/${id}`);
            }}
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
            {event?.name}
          </Typography>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.875rem",
              fontWeight: "normal",
              fontFamily: "Poppins",
            }}
          >
            {event?.description}
          </Typography>
          <Typography
            sx={{
              color: "#0e1113",
              fontSize: "0.75rem",
              fontWeight: "normal",
              fontFamily: "Poppins",
            }}
          >
            {formattedDateRange}
          </Typography>
        </Box>
        {/* Resumo */}
        <div className="cards w-[100%] flex justify-stretch gap-[20px] p-4">
          {cards.map((card) => (
            <Card
              key={card.key}
              title={card.title}
              content={card.content}
              bgColor={card.bgColor}
              textColor={card.textColor}
            />
          ))}
        </div>

        {/* Meta */}
        <Box
          sx={{
            padding: 2,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
                  width: `${
                    (parseInt(event?.current_progress) /
                      parseInt(event?.meta)) *
                    100
                  }%`,
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
              {parseInt(event?.current_progress)}/{parseInt(event?.meta)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", padding: 2, gap: 2 }}>
          <QuestionChart summary={summary} formReference={formReference} />
          <FlowChart summary={summary} setPayload={handlePayload} />
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
              borderRadius: 0,
              boxShadow: "none",
            }}
          >
            <Table sx={{ fontFamily: "Poppins" }}>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f0f3f8",
                  }}
                >
                  <TableCell>
                    <strong>Nome</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Unidade</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agents.map((agent, index) => (
                  <TableRow key={index}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{agent.team}</TableCell>
                    <TableCell>{agent.unit}</TableCell>
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
