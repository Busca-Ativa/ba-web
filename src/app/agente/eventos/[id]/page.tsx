"use client";

import api from "@/services/api";
import { Add, ArrowBackIosNew } from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const EventoDetail = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [geojson, setGeojson] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`/agent/event/${id}`)
      .then((response) => {
        setEventDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event details:", error);
      });
  }, [id]);

  useEffect(() => {
    eventDetails?.data?.event?.full_geometry_ref.map((geometry: any) => {
      api
        .get(
          `/all/geojson?segment_type=${geometry.type}&id_segment=${geometry.ref}`
        )
        .then((response) => {
          setGeojson((prev) => [...prev, response.data]);
        })
        .catch((error) => {
          console.error("Error fetching geometries:", error);
        });
    });
  }, [eventDetails]);

  return (
    <div className="bg-white">
      <Box padding={"17px 25px"} display="flex" alignItems="center" gap={2}>
        <ArrowBackIosNew htmlColor="#13866F" fontSize="small" />
        <Typography
          sx={{
            color: "#1C1B1F",
            fontFamily: "Poppins",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            letterSpacing: "-0.408px",
          }}
        >
          Eventos
        </Typography>
      </Box>
      {eventDetails && (
        <MapContainer
          center={[
            eventDetails.data.centroid.coordinates[1],
            eventDetails.data.centroid.coordinates[0],
          ]}
          zoom={14}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={false}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geojson.map((geo, index) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Polygon
                key={index}
                positions={geo.features[0].geometry.coordinates[0][0].map(
                  ([lon, lat]: [number, number]) => [lat, lon]
                )}
              />
            );
          })}
        </MapContainer>
      )}
      <Typography
        sx={{
          color: "#1C1B1F",
          fontFamily: "Poppins",
          fontSize: "25px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
          padding: "25px",
          paddingBottom: "5px",
        }}
      >
        {eventDetails?.data?.event?.name}
      </Typography>
      <Typography
        sx={{
          color: "#1C1B1F",
          fontFamily: "Poppins",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
          padding: "0 25px 10px 25px",
          width: "90%",
        }}
      >
        {eventDetails?.data?.event?.description}
      </Typography>
      <Typography
        sx={{
          color: "#1C1B1F",
          fontFamily: "Poppins",
          fontSize: "13px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
          padding: "0 25px 25px 25px",
          width: "90%",
        }}
      >
        {new Date(eventDetails?.data?.event?.date_start).toLocaleDateString(
          "en-GB"
        )}{" "}
        -{" "}
        {new Date(eventDetails?.data?.event?.date_end).toLocaleDateString(
          "en-GB"
        )}
      </Typography>
      <Box
        display={"flex"}
        width={"100%"}
        paddingRight={"25px"}
        gap={2}
        justifyContent={"space-between"}
      >
        <Typography
          sx={{
            color: "#1C1B1F",
            fontFamily: "Poppins",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
            letterSpacing: "-0.408px",
            padding: "0 25px 10px 25px",
            width: "90%",
          }}
        >
          Meta
        </Typography>
        <Typography
          sx={{
            color: "#1C1B1F",
            fontFamily: "Poppins",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            letterSpacing: "-0.408px",
          }}
        >
          {eventDetails?.data.event.current_progress}/
          {eventDetails?.data.event.meta}
        </Typography>
      </Box>

      <Box padding={"0 25px 10px 25px"}>
        <Box width={"100%"} height={"30px"} bgcolor={"#D9D9D9"}>
          <Box
            width={
              (eventDetails?.data.event.current_progress /
                eventDetails?.data.event.meta) *
                100 +
              "%"
            }
            height={"30px"}
            bgcolor={"#EE8D10"}
          ></Box>
        </Box>
      </Box>
      <Typography
        sx={{
          color: "#1C1B1F",
          fontFamily: "Poppins",
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
          padding: "20px 25px 10px 25px",
          width: "90%",
        }}
      >
        Agentes
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          padding: "0 20px",
          boxSizing: "border-box",
          boxShadow: "none",
        }}
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
      <Button
        variant="contained"
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#16b394",
          color: "#fff",
          width: "45px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
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
  );
};

export default EventoDetail;
