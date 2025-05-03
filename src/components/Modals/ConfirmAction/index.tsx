import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface ConfirmActionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionLabel: string;
  description: string;
}

const ConfirmAction: React.FC<ConfirmActionProps> = ({
  open,
  onClose,
  onConfirm,
  actionLabel,
  description,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          padding: "30px 40px",
          borderRadius: "10px",
          fontFamily: "Poppins",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: "30px",
          paddingInline: 0,
        }}
      >
        {actionLabel}
      </DialogTitle>
      <DialogContent sx={{ paddingInline: 0 }}>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          paddingInline: 0,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "trasnparent",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
            flex: 1,
            "&:hover": {
              color: "var(--danger-hover)",
              border: "1px solid var(--danger-hover)",
            },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            flex: 1,
            "&:hover": {
              backgroundColor: "var(--primary-dark)",
            },
          }}
          variant="contained"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAction;
