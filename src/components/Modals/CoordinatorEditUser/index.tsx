import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, TextField } from "@mui/material";
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

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: ({
    id,
    identificador,
  }: {
    id: number;
    identificador: string;
  }) => void;
  data: {
    id: number;
    identificador: string;
  };
};

export default function CoordinatorEditUser({
  open,
  onClose,
  onSubmit,
  data,
}: ModalProps) {
  const [identificador, setIdentificador] = useState(data?.identificador);

  useEffect(() => {
    setIdentificador(data?.identificador);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentificador(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({ ...data, identificador });
  };

  const clear = () => {
    setIdentificador("");
  };

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="w-[516px]" sx={style}>
          <Box className="flex flex-col" alignItems="left" mb={2} gap={1}>
            <Image src="/next.svg" alt="Logo" width={30} height={30} />
            <Typography fontFamily={"Poppins"} variant="h4" fontWeight="bold">
              Identificador do Usuário
            </Typography>
          </Box>
          <Box display="flex mt-2">
            <TextField
              fullWidth
              label="Identificador"
              value={identificador}
              onChange={handleChange}
            />
          </Box>
          <Button
            onClick={handleSubmit}
            fullWidth
            sx={{ textTransform: "capitalize" }}
            className="h-[41px] px-4 py-2 bg-[--primary-dark] hover:bg-[--primary-dark] mt-6 rounded justify-center items-center gap-3 inline-flex text-white"
          >
            <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
              Finalizar
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
