import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

interface Event {
  id?: string;
  title?: string;
  description?: string;
  date_start?: string;
  date_end?: string;
  meta?: number;
  meta_unit?: string;
  form?: {
    id?: string;
    title?: string;
  };
  unities?: any[];
  times?: any[];
  agents?: any[];
  uf?: string;
  city?: string;
  segment_type?: string;
  bairros?: any[];
  setores?: any[];
  geometry?: any;
}

export default function NewEvent({ open, onClose, onSubmit }: ModalProps) {
  const [modalState, setModalState] = useState<number>(0);
  const [event, setEvent] = useState<Event>({});

  const handleNext = () => {
    setModalState((prev) => prev + 1);
  };

  const handleBack = () => {
    setModalState((prev) => prev - 1);
  };

  const handleChange = (field: keyof Event, value: any) => {
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStage = () => {
    switch (modalState) {
      case 0:
        return (
          <>
            {/* Título */}
            <Box display={"flex"} flexDirection={"column"} mb={2}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
              >
                Título
              </Typography>
              <TextField
                label="Digite o título"
                fullWidth
                variant="outlined"
                margin="normal"
                value={event.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Box>

            {/* Descrição */}
            <Box display={"flex"} flexDirection={"column"} mb={2}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
              >
                Descrição
              </Typography>
              <TextField
                label="Digite a descrição"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                margin="normal"
                value={event.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Box>

            {/* Datas */}
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Data de Início"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={event.date_start || ""}
                onChange={(e) => handleChange("date_start", e.target.value)}
              />
              <TextField
                label="Data de Fim"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={event.date_end || ""}
                onChange={(e) => handleChange("date_end", e.target.value)}
              />
            </Box>

            {/* Unidade da Meta e Meta */}
            <Box display="flex" gap={2} mb={2}>
              <FormControl fullWidth>
                <InputLabel>Unidade da Meta</InputLabel>
                <Select
                  value={event.meta_unit || ""}
                  onChange={(e) => handleChange("meta_unit", e.target.value)}
                >
                  <MenuItem value="coletas">Coletas</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Meta"
                type="number"
                fullWidth
                variant="outlined"
                value={event.meta || ""}
                onChange={(e) => handleChange("meta", Number(e.target.value))}
              />
            </Box>

            {/* Formulário */}
            <Box display="flex" flexDirection="column" mb={4}>
              <Typography
                fontFamily={"Poppins"}
                variant="body2"
                fontWeight="bold"
              >
                Formulário
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Selecione o formulário</InputLabel>
                <Select
                  value={event.form || ""}
                  onChange={(e) => handleChange("form", e.target.value)}
                >
                  <MenuItem value="form1">Formulário 1</MenuItem>
                  <MenuItem value="form2">Formulário 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </>
        );
      case 1:
        return (
          <Box mb={4}>
            {/* Unidades */}
            <Box display="flex" flexDirection="column" mb={3}>
              <Typography variant="body2" fontWeight="bold">
                Unidades
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.unities || []}
                  onChange={(e) =>
                    handleChange("unities", Array.from(e.target.value))
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  <MenuItem value="Unidade 1">Unidade 1</MenuItem>
                  <MenuItem value="Unidade 2">Unidade 2</MenuItem>
                  <MenuItem value="Unidade 3">Unidade 3</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.unities || []).map((unit, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                      backgroundColor: "#FFE9CC",
                      borderRadius: "8px",
                      px: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {unit}
                    </Typography>
                    <Button
                      size="small"
                      color="warning"
                      sx={{ padding: 0, minWidth: 0 }}
                      onClick={() =>
                        handleChange(
                          "unities",
                          (event.unities || []).filter((u) => u !== unit)
                        )
                      }
                    >
                      x
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Times */}
            <Box display="flex" flexDirection="column" mb={3}>
              <Typography variant="body2" fontWeight="bold">
                Times
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.times || []}
                  onChange={(e) =>
                    handleChange("times", Array.from(e.target.value))
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  <MenuItem value="Time 1">Time 1</MenuItem>
                  <MenuItem value="Time 2">Time 2</MenuItem>
                  <MenuItem value="Time 3">Time 3</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.times || []).map((team, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                      backgroundColor: "#FFE9CC",
                      borderRadius: "8px",
                      px: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {team}
                    </Typography>
                    <Button
                      size="small"
                      color="warning"
                      sx={{ padding: 0, minWidth: 0 }}
                      onClick={() =>
                        handleChange(
                          "times",
                          (event.times || []).filter((t) => t !== team)
                        )
                      }
                    >
                      x
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Agentes */}
            <Box display="flex" flexDirection="column" mb={3}>
              <Typography variant="body2" fontWeight="bold">
                Agentes
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple
                  value={event.agents || []}
                  onChange={(e) =>
                    handleChange("agents", Array.from(e.target.value))
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  <MenuItem value="Agente 1">Agente 1</MenuItem>
                  <MenuItem value="Agente 2">Agente 2</MenuItem>
                  <MenuItem value="Agente 3">Agente 3</MenuItem>
                </Select>
              </FormControl>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {(event.agents || []).map((agent, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                      backgroundColor: "#FFE9CC",
                      borderRadius: "8px",
                      px: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {agent}
                    </Typography>
                    <Button
                      size="small"
                      color="warning"
                      sx={{ padding: 0, minWidth: 0 }}
                      onClick={() =>
                        handleChange(
                          "agents",
                          (event.agents || []).filter((a) => a !== agent)
                        )
                      }
                    >
                      x
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="flex-start"
          >
            {/* Coluna do Formulário */}
            <Box flex={1}>
              {/* Linha 1: Select de UF e Cidade */}
              <Box display="flex" flexDirection="row" gap={2} mb={2}>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold">
                    UF
                  </Typography>
                  <Select
                    value={event.uf || ""}
                    onChange={(e) => handleChange("uf", e.target.value)}
                  >
                    <MenuItem value="SP">São Paulo</MenuItem>
                    <MenuItem value="RJ">Rio de Janeiro</MenuItem>
                    <MenuItem value="MG">Minas Gerais</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold">
                    Cidade
                  </Typography>
                  <Select
                    value={event.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  >
                    <MenuItem value="São Paulo">São Paulo</MenuItem>
                    <MenuItem value="Rio de Janeiro">Rio de Janeiro</MenuItem>
                    <MenuItem value="Belo Horizonte">Belo Horizonte</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Linha 2: Tipo de Segmento */}
              <Box mb={2}>
                <FormControl fullWidth>
                  <Typography variant="body2" fontWeight="bold">
                    Tipo de Segmento
                  </Typography>
                  <Select
                    value={event.segment_type || ""}
                    onChange={(e) =>
                      handleChange("segment_type", e.target.value)
                    }
                  >
                    <MenuItem value="bairros">Bairros</MenuItem>
                    <MenuItem value="setores">Setores</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Linha 3: Select de Bairros ou Setores */}
              {event.segment_type === "bairros" && (
                <Box mb={2}>
                  <FormControl fullWidth>
                    <Typography variant="body2" fontWeight="bold">
                      Bairros
                    </Typography>
                    <Select
                      multiple
                      value={event.bairros || []}
                      onChange={(e) =>
                        handleChange("bairros", Array.from(e.target.value))
                      }
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="Centro">Centro</MenuItem>
                      <MenuItem value="Vila Madalena">Vila Madalena</MenuItem>
                      <MenuItem value="Moema">Moema</MenuItem>
                    </Select>
                  </FormControl>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {(event.bairros || []).map((bairro, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                          alignItems: "center",
                          backgroundColor: "#FFE9CC",
                          borderRadius: "8px",
                          px: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {bairro}
                        </Typography>
                        <Button
                          size="small"
                          color="warning"
                          sx={{ padding: 0, minWidth: 0 }}
                          onClick={() =>
                            handleChange(
                              "bairros",
                              (event.bairros || []).filter((b) => b !== bairro)
                            )
                          }
                        >
                          x
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {event.segment_type === "setores" && (
                <Box mb={2}>
                  <FormControl fullWidth>
                    <Typography variant="body2" fontWeight="bold">
                      Setores
                    </Typography>
                    <Select
                      multiple
                      value={event.setores || []}
                      onChange={(e) =>
                        handleChange("setores", Array.from(e.target.value))
                      }
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="Setor 1">Setor 1</MenuItem>
                      <MenuItem value="Setor 2">Setor 2</MenuItem>
                      <MenuItem value="Setor 3">Setor 3</MenuItem>
                    </Select>
                  </FormControl>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                    {(event.setores || []).map((setor, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                          alignItems: "center",
                          backgroundColor: "#FFE9CC",
                          borderRadius: "8px",
                          px: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {setor}
                        </Typography>
                        <Button
                          size="small"
                          color="warning"
                          sx={{ padding: 0, minWidth: 0 }}
                          onClick={() =>
                            handleChange(
                              "setores",
                              (event.setores || []).filter((s) => s !== setor)
                            )
                          }
                        >
                          x
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Coluna do Mapa */}
            <Box flex={1} mb={4}>
              <Typography variant="body2" fontWeight="bold" mb={0}>
                Mapa
              </Typography>
              <Box
                sx={{
                  height: "350px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <MapContainer
                  center={[51.505, -0.09] as LatLngExpression}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </MapContainer>
              </Box>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderNavigationDots = () => (
    <Box display="flex" justifyContent="center" gap={1} mt={3}>
      {[0, 1, 2].map((stage) => (
        <Button
          key={stage}
          onClick={() => setModalState(stage)}
          sx={{
            minWidth: "10px",
            height: "10px",
            borderRadius: "50%",
            padding: 0,
            backgroundColor: modalState === stage ? "#1976d2" : "#c4c4c4",
            "&:hover": {
              backgroundColor: modalState === stage ? "#115293" : "#a4a4a4",
            },
          }}
        />
      ))}
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className={modalState === 2 ? "w-[900px] h-auto" : "w-[516px] h-auto"}
        sx={style}
      >
        <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
          <Image src="/next.svg" alt="Logo" width={30} height={30} />
          <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
            Novo Evento
          </Typography>
        </Box>

        {renderStage()}

        <Box display="flex" justifyContent="space-between">
          {modalState < 2 ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mr: 1,
                  textTransform: "capitalize",
                }}
                color="error"
                onClick={() => {
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  backgroundColor: "#19B394",
                  "&:hover": {
                    backgroundColor: "#17A384",
                  },
                }}
                className="!text-white"
                onClick={handleNext}
              >
                Continuar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mr: 1,
                  textTransform: "capitalize",
                }}
                color="error"
                onClick={() => {
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                sx={{
                  ml: 1,
                  textTransform: "capitalize",
                  backgroundColor: "#19B394",
                  "&:hover": {
                    backgroundColor: "#17A384",
                  },
                }}
                className="text-white"
                onClick={() => onSubmit(event)}
              >
                Finalizar
              </Button>
            </>
          )}
        </Box>
        {/* Navegação por bolinhas */}
        {renderNavigationDots()}
      </Box>
    </Modal>
  );
}