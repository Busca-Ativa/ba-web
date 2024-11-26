import React, { useState, useEffect, Key } from "react";
import api from "@/services/api";
import { toast } from "react-toastify";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import Image from "next/image";

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

type UFProps = {
  value: string;
  label: string;
};
type CityProps = {
  value: string;
  label: string;
};
type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cbk: any) => void;
};

export default function NewUnitModal({ open, onClose, onSubmit }: ModalProps) {
  const [supervisors, setSupervisors] = useState<
    {
      id: Key | null | undefined;
      value: string;
      label: string;
    }[]
  >([]);
  const [formData, setFormData] = useState({
    unitName: "",
    unitCode: "",
    idSupervisor: "",
  });

  useEffect(() => {
    api.get("/coordinator/institution/users").then((response) => {
      const supervisors = response.data.filter(
        (user: any) => user.role === "supervisor"
      );
      setSupervisors(
        supervisors.map((supervisor: any) => ({
          value: supervisor.id,
          label: supervisor.name,
        }))
      );
    });
  }, []);

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="w-[600px] h-[482px]" sx={style}>
          <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Nova Unidade
            </Typography>
          </Box>

          <TextField
            label="Nome"
            className="mb-4"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={() => {}}
            id="unitName"
          />
          <TextField
            label="Código da Unidade"
            className="mb-4"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={() => {}}
            id="unitCode"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="supervisor-label">Supervisor</InputLabel>
            <Select
              labelId="supervisor-label"
              id="idSupervisor"
              value={formData.idSupervisor}
              label="Supervisor"
              onChange={(event: SelectChangeEvent) => {
                setFormData({ ...formData, idSupervisor: event.target.value });
              }}
            >
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.id} value={supervisor.value}>
                  {supervisor.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display={"flex"} justifyContent={"space-between"} gap={"80px"}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 3, textTransform: "capitalize" }}
              color="error"
              onClick={() => {
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {}}
              fullWidth
              sx={{
                textTransform: "capitalize",
                background: "#19b394",
              }}
              className="h-[41px] px-4 py-2  hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
            >
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Concluir
              </div>
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
