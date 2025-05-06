"use client";

import api from "@/services/api";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const ColetaEvent = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [surveyModel, setSurveyModel] = useState<Model | null>(null);

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
    if (!eventDetails?.data?.event?.form?.survey_schema) return;

    // Obtem localização atual
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const schema =
            typeof eventDetails.data.event.form.survey_schema === "string"
              ? JSON.parse(eventDetails.data.event.form.survey_schema)
              : eventDetails.data.event.form.survey_schema;

          const questions =
            schema.pages?.[0]?.elements?.map((question: any) => ({
              title: question.title,
              id: question.id,
            })) || [];

          const model = new Model(schema);

          model.onComplete.add((sender) => {
            const formData = sender.data;

            const mixed = questions.map(
              (question: { id: any }, index: number) => {
                const key = Object.keys(formData)[index];
                return {
                  id: question.id,
                  value: formData[key],
                };
              }
            );

            const finalData = mixed.reduce((acc: any, item: any) => {
              acc[item.id] = item.value;
              return acc;
            }, {});

            const submitForm = {
              id_event: id,
              id_survey_schema: eventDetails.data.event.form.id,
              coordinate: `${lat} ${lon}`,
              survey_result: finalData,
            };

            api
              .post("/agent/gathering", submitForm)
              .then((response) => {
                toast.success("Formulário enviado com sucesso!");
                setTimeout(() => {
                  location.href = "/agente/eventos/" + id;
                }, 2 * 1000);
              })
              .catch((error) => {
                console.error("Erro ao enviar formulário:", error);
              });
          });

          setSurveyModel(model);
        } catch (err) {
          console.error("Erro ao processar schema do formulário:", err);
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
      },
      {
        enableHighAccuracy: true, // aumenta chance de obter altitude
      }
    );
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
          Evento
        </Typography>
      </Box>

      {surveyModel && <Survey model={surveyModel} />}
      <ToastContainerWrapper />
    </div>
  );
};

export default ColetaEvent;
