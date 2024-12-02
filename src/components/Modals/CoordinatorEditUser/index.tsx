import React, { useState, useEffect } from 'react';
import api from '@/services/api'
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Modal,
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

type UnitProps = {
  id: string;
  name: string;
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (cbk: any) => void;
}


export default function CoordinatorEditUser({ open, onClose, onSubmit }: ModalProps) {

  const [ units, setUnits ] = useState<Array<UnitProps>>();

  const [ formData, setFormData ] = useState({
    id_user: "",
    id_unit:"",
  })

  useEffect( () => {
    const getUnits = async () => {
      try {
        const response = await api.get('/coordinator/institution/units', {withCredentials: true})
        const dataFromApi = response.data;
        setUnits(dataFromApi.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUnits();
  }, [] )

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
      id_user: "",
      id_unit:"",
    })
  }

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className='w-[516px] h-[452px]' sx={style}>
          <Box  className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Mudar origem do Usuário
            </Typography>
          </Box>
          <Box display="flex mt-2">
          <FormControl fullWidth>
            <InputLabel>Unidade</InputLabel>
            <Select
              name='selectedCity'
              value={""}
              onChange={handleSelectChange}
              label="Unidade"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left"
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left"
                },
                getContentAnchorEl: null,
                PaperProps: {
                  // onScroll: loadMoreItems,
                },
                style: {
                  maxHeight: 500,
                },
              }}
            >
            {units?.map(( unit: any ) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          </Box>
            <Button
              onClick={onSubmit}
              fullWidth
              sx={{textTransform: 'capitalize'}}
              className="h-[41px] px-4 py-2  bg-[--primary-dark] hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
            >
              <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                Finalizar
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
        </Modal>
    </div>
  );
}
