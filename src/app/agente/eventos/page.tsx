"use client";

import ToastContainerWrapper from "@/components/ToastContainerWrapper";
import api from "@/services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar";
import WelcomeMessage from "./components/WelcomeMessage";
import EventCard from "./components/EventCard";
import { Box, Typography } from "@mui/material";

const Eventos = () => {
  const [eventos, setEventos] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/all/user")
      .then((response) => {
        setProfile(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Erro ao buscar dados do usuário.");
        setLoading(false);
      });

    api
      .get("/agent/events")
      .then((response) => {
        setEventos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events data:", error);
        toast.error("Erro ao buscar dados dos eventos.");
      });
  }, []);

  useEffect(() => {
    if (profile && profile.institution && profile.institution.code_city) {
      fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${profile.institution.code_city}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da cidade.");
          }
          return response.json();
        })
        .then((data) => {
          setCity(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da cidade:", error);
          toast.error("Erro ao buscar dados da cidade.");
        });
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="loader"></div>
        <style jsx>{`
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #3498db;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa]">
      <Navbar />
      <WelcomeMessage
        name={profile?.name}
        origin={profile?.unit ? profile.unit.name : profile.name}
        city={city?.nome}
      />
      <Typography
        sx={{
          color: "#1C1B1F",
          fontFamily: "Poppins",
          fontSize: "20px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
          paddingLeft: "25px",
          paddingBottom: "10px",
        }}
      >
        Seus Eventos
      </Typography>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "row" }}
        flexWrap={{ sm: "wrap" }}
        gap={4}
        marginBottom={4}
      >
        {eventos.map((evento) => (
          <EventCard
            key={evento.id}
            title={evento.name}
            startDate={evento.date_start}
            finishDate={evento.date_end}
            currentProgress={evento.current_progress}
            total={evento.meta}
            id={evento.id}
          />
        ))}
      </Box>

      <ToastContainerWrapper />
    </div>
  );
};

export default Eventos;
