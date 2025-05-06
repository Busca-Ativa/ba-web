import { Box, Typography } from "@mui/material";
import React from "react";

interface WelcomeMessageProps {
  name: string;
  origin: string;
  city: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  name,
  origin,
  city,
}) => {
  return (
    <Box
      display="flex"
      padding="25px"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography
        variant="h6"
        sx={{
          color: "var(--Neutral-Neutral-7, #0F1113)",
          fontFamily: "Poppins",
          fontSize: "26px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "normal",
        }}
      >
        Olá, {name}!
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "#8A8A8A",
          fontFamily: "Poppins",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 300,
          lineHeight: "normal",
          letterSpacing: "-0.408px",
        }}
      >
        {origin} - {city}
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
