"use client";

import api from "@/services/api";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
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
    if (eventDetails.data.full_geometry_ref) {
      api
        .get(`/geometry/${eventDetails.data.full_geometry_ref}`)
        .then((response) => {
          console.log("Geometries:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching geometries:", error);
        });
    }
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
          {/* Add any additional layers or markers here */}
        </MapContainer>
      )}
    </div>
  );
};

export default EventoDetail;
