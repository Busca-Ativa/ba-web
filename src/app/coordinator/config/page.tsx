'use client'
import React, { useState } from 'react';
import { Box, Button, TextField, IconButton, Tabs, Tab, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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
      <Typography variant="h4" className="text-3xl font-[Poppins] text-[42px]  font-bold mb-8">
        Configurações
      </Typography>

      {/* Tabs */}
      <Tabs
      value={tabValue}
      variant="fullWidth"
      onChange={handleTabChange}
      className="mb-6 bg-[#eeeeee]"
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: '#19f39430', // Red underline for selected tab
          height: '100%',
          zIndex: 0
        },
        '& .Mui-selected': {
          color: '#0da28b', // Green color for selected tab text
        },
      }}
      >
        <Tab label="Perfil" className="capitalize" />
        <Tab label="Instituição" className="capitalize" />
        <Tab label="" className="capitalize" disabled/>
        {/* Add more tabs if needed */}
      </Tabs>

      {/* Profile Section */}
      {tabValue === 0 && (
        <div className="w-1/2">
          <Typography variant="h5" className="text-2xl font-bold text-[30px] mb-2">
            Perfil
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Gerencie as configurações do seu perfil.
          </Typography>

          {/* Form */}
          <div className="space-y-4">
            <Box className="flex flex-row items-center space-x-4 content-center ">
              <TextField
                label="Nome Completo"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {/* Update Button */}
              <Button
                variant="contained"
                className="bg-[#19b394]"
                style={{ textTransform: 'none', right:-128, width:"128px" }}
              >
                Atualizar
              </Button>
            </Box>
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
                type={showPassword ? 'text' : 'password'}
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

        </div>
      )}
      {tabValue === 1 && (
        <div className="w-1/2">
          <Typography variant="h5" className="text-2xl font-bold text-[30px] mb-2">
            Instituição
          </Typography>
          <Typography className="text-gray-600 mb-4">
            Gerencie as configurações da sua instituição.
          </Typography>

          {/* Form */}
          <div className="space-y-4">
            <Box className="flex flex-row items-center justify-items-stretch">
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {/* Update Button */}
              <Button
                variant="contained"
                className="bg-[#19b394]"
                style={{ textTransform: 'none', right:-128, width:"128px" }}
              >
                Atualizar
              </Button>
            </Box>
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
                type={showPassword ? 'text' : 'password'}
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

        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
