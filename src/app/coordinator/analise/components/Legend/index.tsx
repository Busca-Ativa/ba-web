import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Legend = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: 200,
        padding: 2,
        bgcolor: "white",
        borderRadius: 1,
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: "#575757",
          fontSize: "1rem",
          fontWeight: "bold",
          fontFamily: "Poppins",
          marginBottom: 2,
        }}
      >
        Legenda
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 17, height: 17, bgcolor: "#ffbc66" }}></Box>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: "light",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Muita
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 17, height: 17, bgcolor: "#ffe9cc" }}></Box>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: "light",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Quase Muito
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 17, height: 17, bgcolor: "#d2f9f1" }}></Box>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: "light",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Quase pouco
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 17, height: 17, bgcolor: "#19b394" }}></Box>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: "light",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Pouco
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Legend;
