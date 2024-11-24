import React, { useState } from "react";
import { Box, Typography, Select, MenuItem } from "@mui/material";
import Image from "next/image";

const EventAnalyticsControls = () => {
  const [propriedade, setPropriedade] = useState("");
  const [filtro, setFiltro] = useState("");
  const [escala, setEscala] = useState("");
  const [paleta, setPaleta] = useState("");
  const [mapa, setMapa] = useState("");

  const selectStyles = {
    mb: 1,
    height: 24,
    borderRadius: "4px",
    width: "231px",
    color: "#8a8a8a",
    fontSize: "10px",
    fontWeight: "normal",
    fontFamily: "Poppins, sans-serif",
    lineHeight: "21px",
  };

  return (
    <Box
      sx={{
        width: 269,
        height: 779,
        position: "relative",
        backgroundColor: "white",
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 30,
          left: 19,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <div className="logo flex items-center">
          <Image src="/next.svg" alt="Logo" width={40} height={40} />
          <span className="text-[#19B394] mr-1">Busca</span>
          <span className="text-[#FF9814]">Ativa!</span>
        </div>
        <Typography
          marginTop={"10px"}
          variant="h5"
          sx={{
            color: "#0e1113",
            fontWeight: "bold",
            lineHeight: "50px",
          }}
        >
          Evento 1#
        </Typography>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 130,
          left: 19,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          {/* Grupo de selects de Seleção (propriedade) */}
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: 300,
              fontFamily: "Poppins, sans-serif",
              lineHeight: "21px",
              marginBottom: 0,
            }}
          >
            Seleção
          </Typography>
          <Typography
            sx={{
              color: "#161616",
              fontSize: "9px",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Propriedade
          </Typography>

          <Select
            value={propriedade}
            onChange={(e) => setPropriedade(e.target.value)}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="" disabled>
              Propriedade
            </MenuItem>
            <MenuItem value="Propriedade 1">Propriedade 1</MenuItem>
            <MenuItem value="Propriedade 2">Propriedade 2</MenuItem>
            <MenuItem value="Propriedade 3">Propriedade 3</MenuItem>
          </Select>
        </Box>
        <Box>
          {/* Grupo de selects de Filtros */}
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: 300,
              fontFamily: "Poppins, sans-serif",
              lineHeight: "21px",
              marginBottom: 0,
            }}
          >
            Filtros
          </Typography>
          <Typography
            sx={{
              color: "#161616",
              fontSize: "9px",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Setor
          </Typography>

          <Select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="" disabled>
              Setor
            </MenuItem>
            <MenuItem value="Setor 1">Setor 1</MenuItem>
            <MenuItem value="Setor 2">Setor 2</MenuItem>
            <MenuItem value="Setor 3">Setor 3</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography
            sx={{
              color: "#575757",
              fontSize: "0.75rem",
              fontWeight: 300,
              fontFamily: "Poppins, sans-serif",
              lineHeight: "21px",
              marginBottom: 0,
            }}
          >
            Detalhes
          </Typography>
          <Typography
            sx={{
              color: "#161616",
              fontSize: "9px",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Método de Escala
          </Typography>

          <Select
            value={escala}
            onChange={(e) => setEscala(e.target.value)}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="" disabled>
              Método de escala
            </MenuItem>
            <MenuItem value="Escala Linear">Escala Linear</MenuItem>
            <MenuItem value="Escala Logarítmica">Escala Logarítmica</MenuItem>
            <MenuItem value="Escala Exponencial">Escala Exponencial</MenuItem>
          </Select>
          <Typography
            sx={{
              color: "#161616",
              fontSize: "9px",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Paleta de Cores
          </Typography>

          <Select
            value={paleta}
            onChange={(e) => setPaleta(e.target.value)}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="" disabled>
              Paleta de cores
            </MenuItem>
            <MenuItem value="Paleta 1">Paleta 1</MenuItem>
            <MenuItem value="Paleta 2">Paleta 2</MenuItem>
            <MenuItem value="Paleta 3">Paleta 3</MenuItem>
          </Select>
          <Typography
            sx={{
              color: "#161616",
              fontSize: "9px",
              fontWeight: "600",
              fontFamily: "Poppins",
              lineHeight: "21px",
            }}
          >
            Estilo de Mapa
          </Typography>

          <Select
            value={mapa}
            onChange={(e) => setMapa(e.target.value)}
            displayEmpty
            sx={selectStyles}
          >
            <MenuItem value="" disabled>
              Estilo de mapa
            </MenuItem>
            <MenuItem value="Mapa 1">Mapa 1</MenuItem>
            <MenuItem value="Mapa 2">Mapa 2</MenuItem>
            <MenuItem value="Mapa 3">Mapa 3</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default EventAnalyticsControls;
