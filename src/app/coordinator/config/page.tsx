"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSettings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formInstitution, setFormInstitution] = useState({
    name: "",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUserChange = (field: string, value: string) => {
    setFormUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstitutionChange = (field: string, value: string) => {
    setFormInstitution((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserProfile = async () => {
    try {
      const updatedFields = Object.fromEntries(
        Object.entries(formUser).filter(([_, value]) => value)
      );
      const response = await api.patch("/coordinator/user", {
        ...updatedFields,
        id_user:
          typeof window !== "undefined" && typeof localStorage !== "undefined"
            ? localStorage.getItem("user_id")
            : null,
      });
      if (response.status !== 200) {
        throw new Error("Erro ao atualizar perfil");
      }
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const updateInstitution = async () => {
    try {
      const updatedFields = Object.fromEntries(
        Object.entries(formInstitution).filter(([_, value]) => value)
      );
      const response = await api.patch(
        "/coordinator/institution",
        updatedFields
      );
      if (response.status !== 200) {
        throw new Error("Erro ao atualizar instituição");
      }
      toast.success("Instituição atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar instituição");
    }
  };

  return (
    <div className="w-full px-[45px] pt-[60px]">
      {/* Title */}
      <Typography
        variant="h4"
        className="text-3xl font-[Poppins] text-[42px] font-bold mb-8"
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
          },
          "& .Mui-selected": {
            color: "#19B394",
          },
        }}
      >
        <Tab label="Perfil" className="capitalize" />
        <Tab label="Instituição" className="capitalize" />
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
              }}
            >
              Perfil
            </Typography>
            <Typography
              className="text-gray-600 mb-4"
              sx={{
                color: "#575757",
                fontSize: "0.875rem",
              }}
            >
              Gerencie as configurações do seu perfil.
            </Typography>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              value={formUser.name}
              onChange={(e) => handleUserChange("name", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              fullWidth
              value={formUser.email}
              onChange={(e) => handleUserChange("email", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <div className="relative">
              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={formUser.password}
                onChange={(e) => handleUserChange("password", e.target.value)}
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

            <Button
              variant="contained"
              className="bg-[#19b394]"
              onClick={updateUserProfile}
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

      {/* Institution Section */}
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
              }}
            >
              Instituição
            </Typography>
            <Typography
              className="text-gray-600 mb-4"
              sx={{
                color: "#575757",
                fontSize: "0.875rem",
              }}
            >
              Gerencie as configurações da sua instituição.
            </Typography>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={formInstitution.name}
              onChange={(e) => handleInstitutionChange("name", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              className="bg-[#19b394]"
              onClick={updateInstitution}
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
      <ToastContainer />
    </div>
  );
};

export default ProfileSettings;
