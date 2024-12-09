"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ProfileSettings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full  px-[45px] pt-[60px]">
      {/* Title */}
      <Typography
        variant="h4"
        className="text-3xl font-[Poppins] text-[42px]  font-bold mb-8"
      >
        Configurações
      </Typography>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        variant="fullWidth"
        onChange={handleTabChange}
        className="mb-6 bg-[#eeeeee]"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#19f39430",
            height: "100%",
            zIndex: 0,
            fontSize: "0.875rem",
            fontWeight: 500, // font-medium
            fontFamily: "'Poppins', sans-serif", // font-['Poppins']
            lineHeight: "21px", // leading-[21px]
          },
          "& .Mui-selected": {
            color: "#19B394", // Green color for selected tab text
          },
        }}
      >
        <Tab label="Perfil" className="capitalize" />
        <Tab label="Instituição" className="capitalize" />
        <Tab label="" className="capitalize" disabled />
        {/* Add more tabs if needed */}
      </Tabs>

      {/* Profile Section */}
      {tabValue === 0 && (
        <div className="flex flex-col gap-8 w-1/2">
          <div className="flex flex-col gap-4">
            <Typography
              variant="h5"
              className="text-2xl font-bold text-[30px] mb-2"
              sx={{
                color: "#0e1113",
                fontSize: "1.875rem",
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Perfil
            </Typography>
            <Typography
              className="text-gray-600 mb-4"
              sx={{
                color: "#575757",
                fontSize: "0.875rem",
                fontWeight: 400,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: "21px",
              }}
            >
              Gerencie as configurações do seu perfil.
            </Typography>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-6">
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="E-mail"
                type="email"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <div className="relative">
                <TextField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-2"
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>

            {/* Update Button */}
            <Button
              variant="contained"
              className="bg-[#19b394]"
              style={{
                textTransform: "none",
                width: "128px",
                marginTop: "8px",
              }}
            >
              Atualizar
            </Button>
          </div>
        </div>
      )}
      {tabValue === 1 && (
        <div className="flex flex-col gap-8 w-1/2">
          <div className="flex flex-col gap-4">
            <Typography
              variant="h5"
              className="text-2xl font-bold text-[30px] mb-2"
              sx={{
                color: "#0e1113",
                fontSize: "1.875rem",
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Instituição
            </Typography>
            <Typography
              className="text-gray-600 mb-4"
              sx={{
                color: "#575757",
                fontSize: "0.875rem",
                fontWeight: 400,
                fontFamily: "'Poppins', sans-serif",
                lineHeight: "21px",
              }}
            >
              Gerencie as configurações da sua instituição.
            </Typography>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 justify-start">
            <div className="flex flex-col gap-6">
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {/* Update Button */}

              <TextField
                label="E-mail"
                type="email"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <div className="relative">
                <TextField
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-2"
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>
            <Button
              variant="contained"
              className="bg-[#19b394]"
              style={{
                textTransform: "none",
                width: "128px",
                marginTop: "8px",
              }}
            >
              Atualizar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
