import React, { useState, useEffect } from "react";
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

type InstitutionProps = {
  id: string;
  name: string;
  code_city: string;
  code_state: string;
  code: string;
};
type SelectProps = {
  value: string;
  label: string;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cbk: any) => void;
};

export default function NewCoordinatorModalModal({
  open,
  onClose,
  onSubmit,
}: ModalProps) {
  const [institutions, setInstitutions] = useState<Array<InstitutionProps>>([]);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    last_name: "",
    id_institution: "",
    identificador: "",
    password: "",
  });

  const loadMoreItems = (e: any) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      // add your code here
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.type == "checkbox" ? e.target.checked : e.target.value,
    });
  };
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    console.log(e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clear = () => {
    setFormData({
      email: "",
      name: "",
      last_name: "",
      id_institution: "",
      identificador: "",
      password: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {};

  useEffect(() => {
    const getInstitutions = async () => {
      try {
        const fetchedData = await api.get("/admin/institutions", {
          withCredentials: true,
        });
        const result = fetchedData.data;
        if (result.message === "Sucesso") {
          setInstitutions(result.data);
          console.log("Colocou os dados de instituição");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInstitutions();
  }, []);

  useEffect(() => {}, []);

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="h-auto w-auto" sx={style}>
          <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Novo Coordenador
            </Typography>
          </Box>
          <TextField
            label="Nome"
            className="mb-1"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.name}
            id="name"
          />
          <TextField
            label="Sobrenome"
            className="mb-1"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.last_name}
            id="last_name"
          />
          <TextField
            label="Identificador"
            className="mb-1"
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.identificador}
            id="identificador"
          />
          <TextField
            label="Email"
            className="mb-4"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.email}
            id="email"
          />
          <TextField
            label="Senha"
            className="mb-4"
            fullWidth
            required
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.password}
            id="password"
            type="password"
          />

          <Box display="flex mt-2">
            <FormControl fullWidth>
              <InputLabel>Instituição</InputLabel>
              <Select
                name="id_institution"
                value={formData.id_institution}
                onChange={handleSelectChange}
                label="instituição"
                MenuProps={{
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  PaperProps: {
                    onScroll: loadMoreItems,
                  },
                  style: {
                    maxHeight: 400,
                  },
                }}
              >
                {institutions.map((inst: InstitutionProps) => (
                  <MenuItem key={inst.id} value={inst.id}>
                    {inst.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            fullWidth
            sx={{ textTransform: "capitalize", background: "#19b394" }}
            className="h-[41px] px-4 py-2  hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
          >
            <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
              Concluir
            </div>
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2, textTransform: "capitalize" }}
            color="error"
            onClick={() => {
              clear();
              onClose();
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
