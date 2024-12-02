import React, { useEffect } from "react";
import { TableCell } from "@mui/material";
import {
  EditOutlined,
  AnalyticsOutlined,
  DeleteOutline,
  Add,
  Close,
  FileCopyOutlined,
  HowToRegRounded,
  PersonOffRounded,
} from "@mui/icons-material";

interface InsertsSelected {
  id: string;
  selected: boolean;
}

interface Row {
  [key: string]: string | number;
}

interface ActionProps {
  onEdit?: (row: Row) => void;
  onAnalyse?: (row: Row) => void;
  onDelete?: (row: Row, rowIndex: number) => void;
  onInsert?: (selectedId: string) => void;
  onDuplicate?: (row: Row, rowIndex: number) => void;
  onApprove?: (row: Row, rowIndex: number) => void;
  onDisapprove?: (row: Row, rowIndex: number) => void;
  insertsSelected?: InsertsSelected[];
}

interface ButtonActionsProps {
  row: Row;
  rowIndex: number;
  actions: ActionProps;
  config: {
    editable?: boolean;
    analyseble?: boolean;
    deletable?: boolean;
    insertable?: boolean;
    duplicable?: boolean;
    disapproved?: boolean;
    approved?: boolean;
  };
}

const ButtonActions: React.FC<ButtonActionsProps> = ({
  row,
  rowIndex,
  actions,
  config,
}) => {
  const buttonConfigs = [
    {
      condition: config.editable,
      label: "Editar",
      icon: <EditOutlined fontSize="small" />,
      onClick: () => actions.onEdit && actions.onEdit(row),
    },
    {
      condition: config.analyseble,
      label: "Analisar",
      icon: <AnalyticsOutlined fontSize="small" />,
      onClick: () => actions.onAnalyse && actions.onAnalyse(row),
    },
    {
      condition: config.deletable,
      label: null,
      icon: <DeleteOutline fontSize="small" />,
      onClick: () => actions.onDelete && actions.onDelete(row, rowIndex),
    },
    {
      condition: config.approved,
      label: "Aprovar",
      icon: <HowToRegRounded fontSize="small" sx={{ color: "#084407" }} />,
      style: { color: "#084407", backgroundColor: "#B7F7C4", border: "1px solid #B7F7C4" },
      onClick: () => actions.onApprove && actions.onApprove(row, rowIndex),
    },
    {
      condition: config.disapproved,
      label: "Reprovar",
      icon: <PersonOffRounded fontSize="small" sx={{ color: "#440B07" }} />,
      style: { backgroundColor: "#FF9B9B", color: "#440B07", border: "#FF9B9B", },
      onClick: () => actions.onDisapprove && actions.onDisapprove(row, rowIndex),
    },
    {
      condition: config.duplicable,
      label: "Duplicar",
      icon: <FileCopyOutlined fontSize="small" />,
      onClick: () => actions.onDuplicate && actions.onDuplicate(row, rowIndex),
    },
    {
      condition:
        config.insertable &&
        !actions.insertsSelected?.find((i) => i.id === row.id)?.selected,
      label: "Adicionar",
      icon: <Add fontSize="small" sx={{ color: "#40c156" }} />,
      style: { color: "#40c156", border: "1px solid #40c156" },
      onClick: () => actions.onInsert && actions.onInsert(String(row.id)),
    },
    {
      condition:
        config.insertable &&
        actions.insertsSelected?.find((i) => i.id === row.id)?.selected,
      label: "Remover",
      icon: <Close fontSize="small" sx={{ color: "#fff" }} />,
      style: {
        backgroundColor: "#ef4838",
        color: "#fff",
        border: "1px solid #ef4838",
      },
      onClick: () => actions.onInsert && actions.onInsert(String(row.id)),
    },
  ];

  useEffect(() => {
    console.log(config);
  }, [ ]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        gap: "10px",
        marginRight: "10px",
      }}
    >
      {buttonConfigs.map(
        (button, index) =>
          button.condition && (
            <TableCell key={index} sx={{ padding: "4px" }}>
              <button
                onClick={button.onClick}
                style={{
                  backgroundColor: "#FFF",
                  color: "#1D2432",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #CACDD5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  width:
                    button.label === "Duplicar"
                      ? "190px"
                      : button.label === null
                      ? "fit-content"
                      : "120px",
                  ...button.style,
                }}
              >
                {button.icon}
                {button.label && <span>{button.label}</span>}
              </button>
            </TableCell>
          )
      )}
    </div>
  );
};

export default ButtonActions;
