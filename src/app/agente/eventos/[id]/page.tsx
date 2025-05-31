"use client";

import api from "@/services/api";
import { Add, ArrowBackIosNew, Sync } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EventoDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [geojson, setGeojson] = useState<any[]>([]);
  const [hasPendingSubmission, setHasPendingSubmission] = useState(false);

  const pendingKey = `pending_submission_${id}`;

  // Verifica se existe evento pendente para esse ID
  const checkPendingSubmission = () => {
    const pending = localStorage.getItem(pendingKey);
    setHasPendingSubmission(!!pending);
  };

  // Envia e remove o evento pendente
  const syncPendingSubmission = async () => {
    const stored = localStorage.getItem(pendingKey);
    if (!stored) return;

    try {
      const submitForm = JSON.parse(stored);
      await api.post("/agent/gathering", submitForm);
      localStorage.removeItem(pendingKey);
      setHasPendingSubmission(false);
      alert("Evento sincronizado com sucesso!");
    } catch (error) {
      console.error("Erro ao sincronizar evento:", error);
      alert("Erro ao sincronizar evento.");
    }
  };

  useEffect(() => {
    api
      .get(`/agent/event/${id}`)
      .then((response) => setEventDetails(response.data))
      .catch((error) => console.error("Erro ao buscar evento:", error));

    checkPendingSubmission();
  }, [id]);

  useEffect(() => {
    eventDetails?.data?.event?.full_geometry_ref.forEach((geometry: any) => {
      api
        .get(
          `/all/geojson?segment_type=${geometry.type}&id_segment=${geometry.ref}`
        )
        .then((response) => setGeojson((prev) => [...prev, response.data]))
        .catch((error) => console.error("Erro ao buscar geometria:", error));
    });
  }, [eventDetails]);

  return (
    <div className="bg-white">
      {/* Header */}
      <Box padding={"17px 25px"} display="flex" alignItems="center" gap={2}>
        <ArrowBackIosNew htmlColor="#13866F" fontSize="small" />
        <Typography fontSize="20px" fontWeight={500}>
          Eventos
        </Typography>
      </Box>

      {/* Mapa */}
      {eventDetails && (
        <MapContainer
          center={[
            eventDetails.data.centroid.coordinates[1],
            eventDetails.data.centroid.coordinates[0],
          ]}
          zoom={14}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          {geojson.map((geo, index) => (
            <Polygon
              key={index}
              positions={geo.features[0].geometry.coordinates[0][0].map(
                ([lon, lat]: [number, number]) => [lat, lon]
              )}
            />
          ))}
        </MapContainer>
      )}

      {/* Detalhes do Evento */}
      <Typography padding="25px 25px 5px" fontSize="25px" fontWeight={500}>
        {eventDetails?.data?.event?.name}
      </Typography>
      <Typography padding="0 25px 10px" fontSize="16px">
        {eventDetails?.data?.event?.description}
      </Typography>
      <Typography padding="0 25px 25px" fontSize="13px">
        {new Date(eventDetails?.data?.event?.date_start).toLocaleDateString(
          "pt-BR"
        )}{" "}
        -{" "}
        {new Date(eventDetails?.data?.event?.date_end).toLocaleDateString(
          "pt-BR"
        )}
      </Typography>

      {/* Meta */}
      <Box
        display="flex"
        justifyContent="space-between"
        paddingRight="25px"
        gap={2}
      >
        <Typography padding="0 25px 10px" fontSize="20px" fontWeight={600}>
          Meta
        </Typography>
        <Typography fontSize="16px" fontWeight={500}>
          {eventDetails?.data.event.current_progress}/
          {eventDetails?.data.event.meta}
        </Typography>
      </Box>
      <Box padding="0 25px 10px 25px">
        <Box width="100%" height="30px" bgcolor="#D9D9D9">
          <Box
            width={
              (eventDetails?.data.event.current_progress /
                eventDetails?.data.event.meta) *
                100 +
              "%"
            }
            height="30px"
            bgcolor="#EE8D10"
          />
        </Box>
      </Box>

      {/* Agentes */}
      <Typography padding="20px 25px 10px" fontSize="20px" fontWeight={600}>
        Agentes
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", padding: "0 20px" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#F5F5F5" }}>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Unidade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventDetails?.data?.event?.solo_agents?.map((agent: any) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.identificator}</TableCell>
                <TableCell>{`${agent.name} ${agent.lastName}`}</TableCell>
                <TableCell>{agent.unit?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex justify-start items-center p-4">
        {/* Botão de sincronizar evento (se houver pendente) */}
        {hasPendingSubmission && (
          <Tooltip title="Você possui um evento pendente" arrow>
            <Button
              variant="contained"
              onClick={syncPendingSubmission}
              sx={{
                position: "fixed",
                bottom: "85px",
                right: "20px",
                backgroundColor: "#f39c12",
                color: "#fff",
                height: "50px",
                borderRadius: "12px",
                padding: "0 15px",
                "&:hover": {
                  backgroundColor: "#d68910",
                },
              }}
            >
              <Sync sx={{ marginRight: "8px" }} />
              Sincronizar evento
            </Button>
          </Tooltip>
        )}

        {/* Botão para iniciar coleta */}
        <Button
          disabled={hasPendingSubmission}
          variant="contained"
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#16b394",
            color: "#fff",
            width: "45px",
            height: "50px",
            borderRadius: "15%",
            "&:hover": {
              backgroundColor: "#13866F",
            },
          }}
          onClick={() => {
            window.location.href = `/agente/eventos/coleta/${id}`;
          }}
        >
          <Add />
        </Button>
      </div>
    </div>
  );
};

export default EventoDetail;
