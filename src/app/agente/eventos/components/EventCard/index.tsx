import { Box, Typography } from "@mui/material";
import {
  parseISO,
  format,
  differenceInCalendarDays,
  isBefore,
  isAfter,
  isWithinInterval,
} from "date-fns";
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  startDate: string;
  finishDate: string;
  currentProgress: number;
  total: number;
}

const EventCard = ({
  id,
  title,
  startDate,
  finishDate,
  currentProgress,
  total,
}: EventCardProps) => {
  const start = new Date(startDate);
  const finish = new Date(finishDate);
  const today = new Date();

  let statusText = "";
  let bgColor = "#13866F"; // verde padrão

  if (isBefore(today, start)) {
    const daysUntilStart = differenceInCalendarDays(start, today);
    statusText = `Inicia em ${daysUntilStart} dia${
      daysUntilStart !== 1 ? "s" : ""
    }`;
    bgColor = "#A0A0A0"; // cinza
  } else if (isAfter(today, finish)) {
    statusText = "Evento finalizado!";
    bgColor = "#A0A0A0"; // cinza
  } else {
    const daysUntilEnd = differenceInCalendarDays(finish, today);
    statusText = `Finaliza em ${daysUntilEnd} dia${
      daysUntilEnd !== 1 ? "s" : ""
    }`;
  }

  return (
    <Box paddingInline="25px" width={{ xs: "100%", sm: "calc(50% - 20px)" }}>
      <Link href={`/agente/eventos/${id}`} style={{ textDecoration: "none" }}>
        <Box
          sx={{
            background: bgColor,
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            padding: "5px 10px",
            color: "#FFFF",
            fontFamily: "Poppins",
            fontSize: "12px",
          }}
        >
          {statusText}
        </Box>
        <Box
          sx={{
            padding: "10px",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            boxShadow: "0px 2px 2px 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            sx={{
              color: "#1C1B1F",
              fontFamily: "Poppins",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
              letterSpacing: "-0.408px",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              color: "#7C7C7C",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "normal",
              letterSpacing: "-0.408px",
            }}
          >
            Período: {format(start, "dd/MM")} - {format(finish, "dd/MM")}
          </Typography>
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  letterSpacing: "-0.408px",
                }}
              >
                Sua Meta
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  textAlign: "right",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 300,
                  lineHeight: "normal",
                  letterSpacing: "-0.408px",
                }}
              >
                {currentProgress}/{total}
              </Typography>
            </Box>
            <Box width={"100%"} height={"20px"} bgcolor={"#D9D9D9"}>
              <Box
                width={(currentProgress / total) * 100 + "%"}
                height={"20px"}
                bgcolor={"#EE8D10"}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};

export default EventCard;
