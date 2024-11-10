import React, { useState, useEffect } from 'react';
import api from '@/services/api'
import { toast } from "react-toastify";
import { getEstadoById, getCidadeById } from "@/services/ibge/api"
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
} from '@mui/material';
import Image from "next/image";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type UFProps = {
  value: string;
  label: string;
}
type CityProps = {
  value: string;
  label: string;
}
type ModalProps = {
  open: boolean;
  onClose: () => void;
}


export default function NewInstitutionModal({ open, onClose, onSubmit }: ModalProps) {

  const [ufs, setUfs] = useState<Array<UFProps>>([]);
  const [cities, setCities] = useState<Array<CityProps>>([]);
  const [openNext, setOpenNext] = useState(false);

  const [ formData, setFormData ] = useState({
    institutionName: "",
    selectedUF: "",
    selectedCity: "",
    coordinatorName:"",
    coordinatorLastName: "",
    coordinatorEmail: "",
    coordinatorPassword:"",
    skip: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.type == 'checkbox'? e.target.checked : e.target.value,
    });
  };
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clear = () => {
    setFormData({
      institutionName: "",
      selectedUF: "",
      selectedCity: "",
      coordinatorName:"",
      coordinatorLastName: "",
      coordinatorEmail: "",
      coordinatorPassword:"",
      skip: false
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    let id_institution = ''
    try {
      const response: any = await api.post('/admin/institution', { name:formData.institutionName, code_state: formData.selectedUF, code_city: formData.selectedCity })
      const data = response.data.data;
      const newInstitution = {
          ...data,
          estado: getEstadoById(data.code_state),
          cidade: getCidadeById(data.code_state, data.code_city)
      }
      onSubmit(newInstitution)
      id_institution = newInstitution.id
      clear();
      onClose();

    } catch (error) {
        toast.error(
          `Erro ao criar instituição!
          Erro: ${error}
          `
        );
    }

    if (formData.skip === false){
      try {
        const response: any = await api.post('/admin/coordinator',
        {
          name : formData.coordinatorName,
          last_name : formData.coordinatorLastName,
          email : formData.coordinatorEmail,
          password : formData.coordinatorPassword,
          id_institution : id_institution
        }, { withCredentials: true })

      } catch (error) {
        toast.error(
          `Erro ao adicionar coordenador!
          Erro: ${error}
          `
        );

      }
    }
  };

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        response.json().then(data => {
          const ufOptions: Array<UFProps> = data.map(( uf: any ) => ({
            value: uf.id,
            label: uf.sigla
          }));
          setUfs(ufOptions);
        })
      })
      .catch(error => console.error("Error fetching UFs:", error));
  }, []);

  useEffect(() => {
    if (formData.selectedUF) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.selectedUF}/municipios`)
        .then(response => {
          response.json().then(data => {
            const cityOptions: Array<CityProps> = data.map(( city: any ) => ({
              value: city.id,
              label: city.nome
            }));
            setCities(cityOptions);
          });
        })
        .catch(error => console.error("Error fetching cities:", error));
    } else {
      setCities([]); // Clear cities if no UF is selected
    }
  }, [formData.selectedUF]);

  const canGoToNextPage = () => {
    return formData.selectedUF != '' && formData.selectedCity !== '' && formData.institutionName.trim() !== '';
  };

  const canFinish = () => {
    return (formData.coordinatorEmail.trim() != '' && formData.coordinatorName.trim() !== '' && formData.coordinatorPassword.trim() !== '' && formData.coordinatorLastName.trim() !== '') || formData.skip ;

  }

  return (
    <div >
      <Modal open={open} onClose={onClose}>
      {
        !openNext ? (
        <Box className='w-[516px] h-[452px]' sx={style}>
          <Box  className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Nova Instituição
            </Typography>
          </Box>

          <TextField
            label="Nome"
            className='mb-4'
            fullWidth
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            value={formData.institutionName}
            id='institutionName'
          />

          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>UF</InputLabel>
              <Select
                name='selectedUF'
                value={formData.selectedUF}
                onChange={handleSelectChange}
                label="UF"
              >
              {ufs.map(uf => (
                <MenuItem key={uf.value} value={uf.value}>
                  {uf.label}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Cidade</InputLabel>
              <Select
                name='selectedCity'
                value={formData.selectedCity}
                onChange={handleSelectChange}
                label="Cidade"
              >
              {cities.map(uf => (
                <MenuItem key={uf.value} value={uf.value}>
                  {uf.label}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Box>
            <Button
              onClick={() => setOpenNext(true)}
              fullWidth
              disabled={!canGoToNextPage()}
              sx={{textTransform: 'capitalize', background:canGoToNextPage()?"#19b394":"#aaaaaa"}}
              className="h-[41px] px-4 py-2  hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
            >
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Próximo
              </div>
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{mt:2, textTransform: 'capitalize'}}
              color="error"
              onClick={() => { clear(); onClose() }}
            >
              Cancelar
            </Button>
          </Box>
        ) :
          (
        <Box className='w-[516px] ' sx={style}>
          <Box  className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Adicione um coordenador
            </Typography>
          </Box>

          <TextField
            id="coordinatorName"
            label="Nome"
            className='mb-4'
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.coordinatorName}
            onChange={handleChange}
          />

          <TextField
            id="coordinatorLastName"
            label="Sobrenome"
            className='mb-4'
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.coordinatorLastName}
            onChange={handleChange}
          />

          <TextField
            id="coordinatorEmail"
            label="Email"
            className='mb-4'
            fullWidth
            variant="outlined"
            margin="normal"
            value={formData.coordinatorEmail}
            onChange={handleChange}
          />

          <TextField
            id="coordinatorPassword"
            label="Password"
            className='mb-4'
            fullWidth
            type='password'
            variant="outlined"
            margin="normal"
            value={formData.coordinatorPassword}
            onChange={handleChange}
          />
        <FormGroup>
          <FormControlLabel control={<Checkbox id="skip" value={formData.skip} onChange={handleChange}/>} label="Deseja pular adição do coordenador?" />
        </FormGroup>
          <Button
            onClick={(e: React.FormEvent) => handleSubmit(e)}
            fullWidth
            disabled={!canFinish()}
            sx={{textTransform: 'capitalize', background:canFinish()?"#19b394":"#aaaaaa"}}
            className="h-[41px] px-4 py-2 hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
          >
            <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
              Concluído
            </div>
          </Button>
          <Box className="flex flex-row gap-2">
            <Button
              variant="outlined"
              fullWidth
              sx={{mt:2, textTransform: 'capitalize'}}
              color="primary"
              onClick={() => {setOpenNext(false);}}
            >
              Voltar
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{mt:2, textTransform: 'capitalize'}}
              color="error"
              onClick={() => {setOpenNext(false); clear(); onClose();}}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
        )
      }
      </Modal>
    </div>
  );
}
