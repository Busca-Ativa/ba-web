"use client";

import api from "@/services/api";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Box, LinearProgress, Typography } from "@mui/material";
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
  const [enviando, setEnviando] = useState(false);
  const [enviadoComSucesso, setEnviadoComSucesso] = useState(false);

  const localStorageKey = `pending_submission_${id}`;

  const trySubmit = (submitForm: any, retryCallback: () => void) => {
    api
      .post("/agent/gathering", submitForm)
      .then(() => {
        toast.success("Formulário enviado com sucesso!");
        localStorage.removeItem(localStorageKey);
        setEnviando(false);
        setEnviadoComSucesso(true);
        setTimeout(() => {
          location.href = "/agente/eventos/" + id;
        }, 2000);
      })
      .catch((error) => {
        console.error(
          "Erro ao enviar formulário. Nova tentativa em 5s...",
          error
        );
        retryCallback();
      });
  };

  useEffect(() => {
    api
      .get(`/agent/event/${id}`)
      .then((response) => {
        setEventDetails(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes do evento:", error);
      });
  }, [id]);

  useEffect(() => {
    if (!eventDetails?.data?.event?.form?.survey_schema) return;

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
          model.showCompletedPage = false;

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

            localStorage.setItem(localStorageKey, JSON.stringify(submitForm));
            setEnviando(true);

            const retry = () =>
              setTimeout(() => trySubmit(submitForm, retry), 5000);
            trySubmit(submitForm, retry);
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
        enableHighAccuracy: true,
      }
    );
  }, [eventDetails]);

  return (
    <div className="bg-white">
      <Box padding={"17px 25px"} display="flex" alignItems="center" gap={2}>
        <ArrowBackIosNew
          htmlColor="#13866F"
          fontSize="small"
          onClick={() => {
            location.href = "/agente/eventos/" + id;
          }}
        />
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

      {surveyModel && !enviadoComSucesso && (
        <>
          {enviando && (
            <div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-90"
              style={{ minHeight: "100vh", minWidth: "100vw" }}
            >
              <span className="mb-4 w-3/4 max-w-lg px-4">
                <LinearProgress
                  className="w-full"
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#E0F2F1",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#13866F",
                    },
                  }}
                />
              </span>
              <div className="text-3xl font-semibold text-center text-gray-700">
                Formulário salvo. Tentando sincronizar com o servidor...
              </div>
            </div>
          )}
          <Survey model={surveyModel} />
        </>
      )}

      {surveyModel && enviadoComSucesso && (
        <div className="text-2xl text-center text-green-700 font-semibold">
          Obrigado por sua resposta!
        </div>
      )}

      <ToastContainerWrapper />
    </div>
  );
};

export default ColetaEvent;
