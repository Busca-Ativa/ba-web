import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import icon from "../../../../favicon.ico";
import Image from "next/image";
import { MoreVert } from "@mui/icons-material";
import { useState } from "react";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
    }
    window.location.href = "/login";
  };
  const handleConfig = () => {
    window.location.href = "/agente/configuracoes";
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "64px",
        padding: "0 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FAFAFA",
        boxShadow: "0px 4px 4px 0px rgba(221, 221, 221, 0.25)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Image width={30} height={30} src={icon.src} alt="logo busca ativa" />
        <Typography
          sx={{
            color: "#19B394",
            fontFamily: "Poppins",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            textTransform: "uppercase",
          }}
        >
          Busca
        </Typography>
        <Typography
          sx={{
            color: "#FF9814",
            fontFamily: "Poppins",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
            textTransform: "uppercase",
            position: "relative",
            right: "5px",
          }}
        >
          Ativa!
        </Typography>
      </Box>

      <Box>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <MoreVert htmlColor="#19B394" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleConfig()}>Configurações</MenuItem>
          <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
