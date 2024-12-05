import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Modal,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import api from "@/services/api";

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
  edit?: boolean;
  data?: any;
};

export default function NewTeamModal({
  open,
  onClose,
  onSubmit,
  edit,
  data,
}: ModalProps) {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    id_unit: data?.id_unit || "",
    users: data?.agents || [],
    active: true,
  });
  const [units, setUnits] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);

  useEffect(() => {
    if (edit) {
      setFormData({
        name: data?.name,
        id_unit: data?.id_unit,
        users: data?.agents,
        active: data?.active,
      });
    }
  }, [data, edit]);

  useEffect(() => {
    // Requisição para buscar as unidades
    api
      .get("/coordinator/institution/units")
      .then((response) => setUnits(response.data.data))
      .catch((err) => console.error("Erro ao buscar unidades:", err));

    // Requisição para buscar os agentes
    api
      .get("/coordinator/institution/users")
      .then((response) => {
        const filtered = response.data.data.filter(
          (user: any) => user.role === "agent" && user.active
        );
        setAgents(filtered);
      })
      .catch((err) => console.error("Erro ao buscar agentes:", err));
  }, []);

  // Atualizar os agentes disponíveis com base na unidade selecionada
  useEffect(() => {
    if (formData.id_unit) {
      const filtered = agents.filter(
        (agent: any) => agent.unit?.id === formData.id_unit
      );
      setFilteredAgents(filtered);
    } else {
      setFilteredAgents([]);
    }
  }, [formData.id_unit, agents]);

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      id_unit: formData.id_unit,
      agents: formData.users.map((agent: any) => agent.id),
      active: formData.active,
    };
    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: 600 }}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {edit ? `Editar Time: ${data?.name}` : "Novo Time"}
        </Typography>

        <TextField
          label="Nome do Time"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={edit}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="unit-label">Unidade</InputLabel>
          <Select
            labelId="unit-label"
            value={formData.id_unit}
            onChange={(e: SelectChangeEvent) =>
              setFormData({ ...formData, id_unit: e.target.value, users: [] })
            }
            disabled={edit}
          >
            {units.map((unit: any) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="agents-label">Agentes</InputLabel>
          <Select
            labelId="agents-label"
            multiple
            value={formData.users}
            onChange={(e: SelectChangeEvent<any>) =>
              setFormData({ ...formData, users: e.target.value })
            }
            disabled={edit || !formData.id_unit}
          >
            {filteredAgents.map((agent: any) => (
              <MenuItem key={agent.id} value={agent}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <FormControlLabel
          control={
            <Checkbox
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              name="active"
            />
          }
          label="Ativo"
        /> */}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            sx={{
              textTransform: "capitalize",
              width: "48%",
              height: "41px",
            }}
            color="error"
            onClick={() => {
              setFormData({} as any);
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || (!edit && !formData.id_unit)}
            sx={{
              textTransform: "capitalize",
              background: "#19b394",
              width: "48%",
              height: "41px",
            }}
            className="hover:bg-[--primary-dark] rounded text-white"
          >
            {edit ? "Salvar" : "Concluir"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
