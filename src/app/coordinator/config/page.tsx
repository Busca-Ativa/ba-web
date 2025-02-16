"use client";
import React, { useEffect, useState } from "react";
import { Button, TextField, Tabs, Tab } from "@mui/material";
import api from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContextStore } from "@/stores/contextStore";

const ProfileSettings: React.FC = () => {
  const { ensureUserOrigin } = useContextStore();
  const [tabValue, setTabValue] = useState(0);
  const [formUser, setFormUser] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const [formInstitution, setFormInstitution] = useState({
    name: "",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserChange = (field: string, value: string) => {
    setFormUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleInstitutionChange = (field: string, value: string) => {
    setFormInstitution((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/all/user", {
          withCredentials: true,
        });
        if (response.status !== 200) {
          throw new Error("Erro ao buscar dados do usuário");
        }
        const { name, lastName, email } = response.data;
        setFormUser({ name, lastName, email });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados do usuário");
      }
    };

    const fetchInstitutionData = async () => {
      try {
        const response = await api.get("/coordinator/institution");
        if (response.status !== 200) {
          throw new Error("Erro ao buscar dados da instituição");
        }
        const { name } = response.data.data.institution;
        setFormInstitution({ name });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao buscar dados da instituição");
      }
    };

    if (tabValue === 0) fetchUserData();
    if (tabValue === 1) fetchInstitutionData();
  }, [tabValue]);

  const updateUserProfile = async () => {
    try {
      const updatedFields = Object.fromEntries(
        Object.entries(formUser).filter(([_, value]) => value)
      );
      const response = await api.patch("/all/user", {
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
      await ensureUserOrigin();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar instituição");
    }
  };

  return (
    <div className="w-full px-[45px] pt-[60px]">
      {/* Title */}
      <h1 className="mb-8">Configurações</h1>

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
          "& .MuiTab-root": {
            color: "#575757",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "21px",
            textTransform: "none",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#19B394",
          },
        }}
      >
        <Tab label="Perfil" />
        <Tab label="Instituição" />
      </Tabs>

      {/* Profile Section */}
      {tabValue === 0 && (
        <div className="flex flex-col gap-8 w-1/2">
          <div className="flex flex-col gap-4 mt-7">
            <div className="text-2xl font-bold text-[30px] mb-2 font-['Poppins']">
              Perfil
            </div>
            <div className="text-gray-600 mb-4 font-['Poppins']">
              Gerencie as configurações do seu perfil.
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              value={formUser.name}
              onChange={(e) => handleUserChange("name", e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Sobrenome"
              variant="outlined"
              fullWidth
              value={formUser.lastName}
              onChange={(e) => handleUserChange("lastName", e.target.value)}
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

            <Button
              variant="contained"
              className="bg-[#19b394]"
              onClick={updateUserProfile}
              sx={{
                fontFamily: "Poppins",
                textTransform: "none",
                width: "128px",
                marginTop: "8px",
                "&:hover": {
                  backgroundColor: "#128a76",
                },
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
          <div className="flex flex-col gap-4 mt-7">
            <div className="text-2xl font-bold text-[30px] mb-2 font-['Poppins']">
              Instituição
            </div>
            <div className="text-gray-600 mb-4 font-['Poppins']">
              Gerencie as configurações da sua instituição.
            </div>
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
              sx={{
                fontFamily: "Poppins",
                textTransform: "none",
                width: "128px",
                marginTop: "8px",
                "&:hover": {
                  backgroundColor: "#128a76",
                },
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
