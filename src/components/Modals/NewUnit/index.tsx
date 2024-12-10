import React, { useState, useEffect, Key, act } from "react";
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
  edit?: boolean;
  data?: any;
};

export default function NewUnitModal({
  open,
  onClose,
  onSubmit,
  edit,
  data,
}: ModalProps) {
  const [supervisors, setSupervisors] = useState<
    {
      id: Key | null | undefined;
      value: string;
      label: string;
    }[]
  >([]);
  const [formData, setFormData] = useState({
    unitName: data?.name || "",
    unitCode: data?.code || "",
    idSupervisor: data?.id_supervisor || "",
    active: data?.active || true,
  });

  useEffect(() => {
    if (edit) {
      setFormData({
        unitName: data?.name,
        unitCode: data?.code,
        idSupervisor: data?.id_supervisor,
        active: data?.active,
      });
    }
  }, [data?.active, data?.code, data?.id_supervisor, data?.name, edit]);

  useEffect(() => {
    api.get("/coordinator/supervisors").then((response) => {
      const supervisors = response.data.filter(
        (user: any) => user.role === "supervisor"
      );
      setSupervisors([
        {
          value: localStorage.getItem("user_id"),
          label: "Coordenador",
        } as any,
        ...supervisors.map((supervisor: any) => ({
          value: supervisor.id,
          label: supervisor.name,
        })),
      ]);
    });
  }, []);

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  useEffect(() => {
    console.log("supervisors", supervisors);
  }, [supervisors]);

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="w-[600px] " sx={style}>
          <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              {edit ? `${data?.name}` : "Nova Unidade"}
            </Typography>
          </Box>

          <TextField
            label="Nome"
            className="mb-4"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(event) =>
              setFormData({ ...formData, unitName: event.target.value })
            }
            value={formData.unitName}
            id="unitName"
          />
          <TextField
            label="Código da Unidade"
            className="mb-4"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={(event) =>
              setFormData({ ...formData, unitCode: event.target.value })
            }
            value={formData.unitCode}
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
                console.log(event.target.value);
                setFormData({ ...formData, idSupervisor: event.target.value });
              }}
            >
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.value} value={supervisor.value}>
                  {supervisor.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {edit && data?.active == false && (
            <FormControl fullWidth margin="normal">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.active}
                    onChange={(event) =>
                      setFormData({ ...formData, active: event.target.checked })
                    }
                    name="active"
                  />
                }
                label="Ativar unidade"
              />
            </FormControl>
          )}

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap="16px"
            mt={4}
          >
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
              onClick={() => {
                onSubmit(formData);
              }}
              sx={{
                textTransform: "capitalize",
                background: "#19b394",
                width: "48%",
                height: "41px",
              }}
              className="hover:bg-[--primary-dark] rounded text-white"
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
