import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";

interface InsertTagsDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (tags: string[]) => void;
  initialTags: string[];
}

const InsertTagsDialog: React.FC<InsertTagsDialogProps> = ({
  open,
  onClose,
  onConfirm,
  initialTags,
}) => {
  const [input, setInput] = useState("");
  const [internalTags, setInternalTags] = useState<string[]>([]);

  useEffect(() => {
    setInternalTags(initialTags);
  }, [initialTags]);

  const handleAddTag = () => {
    const newTag = input.trim();
    if (newTag && !internalTags.includes(newTag)) {
      setInternalTags((prev) => [...prev, newTag]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setInternalTags((prev) => prev.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: "500px",
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
        Inserir Tags
      </DialogTitle>
      <DialogContent
        sx={{
          paddingInline: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label="Digite uma tag"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          sx={{ mt: 1 }}
          onKeyDown={handleKeyDown}
          variant="outlined"
          fullWidth
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {internalTags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              sx={{ fontFamily: "Poppins" }}
            />
          ))}
        </Box>
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
            backgroundColor: "transparent",
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
          onClick={() => onConfirm(internalTags)}
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

export default InsertTagsDialog;
