"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { useState } from "react";
import {
  DeleteOutline,
  Edit,
  EditOutlined,
  FileCopy,
  FileCopyOutlined,
} from "@mui/icons-material";
import Status from "../Status";

interface Column {
  id: string;
  label: string;
  numeric: boolean;
}

interface Config {
  editable?: boolean;
  deletable?: boolean;
  duplicable?: boolean;
}

interface BATableProps {
  columns: Column[];
  initialRows: Record<string, string | number>[];
  configRows?: Config[];
  onEdit?: (row: Record<string, string | number>) => void;
  onDelete?: (row: Record<string, string | number>) => void;
  onDuplicate?: (row: Record<string, string | number>) => void;
}

// Customização do tema
const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
    allVariants: {
      color: "#0e1113",
    },
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": {
            backgroundColor: "#F8F9FC",
          },
          "&:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px",
          borderBottom: "none", // Remove as bordas
        },
        head: {
          color: "#0F1113",
          fontWeight: "bold",
          backgroundColor: "#F1F3F9",
          borderBottom: "none", // Remove as bordas no cabeçalho
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0", // Garante que não há bordas visíveis
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none", // Remove box-shadow do Paper
        },
      },
    },
  },
});

type Order = "asc" | "desc" | undefined;

const BATable: React.FC<BATableProps> = ({
  columns,
  initialRows,
  onEdit,
  onDelete,
  configRows,
  onDuplicate,
}) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | undefined>(columns[0]?.id);
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const handleRequestSort = (property: string) => {
    const isAsc = order === "asc";
    const newOrder = orderBy === property ? (isAsc ? "desc" : "asc") : "asc";
    setOrder(newOrder);
    setOrderBy(property);

    const sortedRows = [...rows].sort((a, b) => {
      if (a[property] < b[property]) return isAsc ? -1 : 1;
      if (a[property] > b[property]) return isAsc ? 1 : -1;
      return 0;
    });

    setRows(sortedRows);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Cálculo dos registros exibidos por página
  const paginatedRows = rows.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const displayText = `${(page - 1) * rowsPerPage + 1} a ${Math.min(
    page * rowsPerPage,
    rows.length
  )} de ${rows.length} registros`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              {configRows && <TableCell sx={{ padding: 0 }}></TableCell>}
              {configRows && <TableCell sx={{ padding: 0 }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.id === "status" ? (
                      <Status
                        status={row[column.id]}
                        bgColor={
                          row[column.id] == "Em Edição"
                            ? "#FFE9A6"
                            : row[column.id] == "Pronto"
                            ? "#ADDBBA"
                            : "#BBBEC3"
                        }
                        color={
                          row[column.id] == "Em Edição"
                            ? "#BE9007"
                            : row[column.id] == "Pronto"
                            ? "#008E20"
                            : "#43494E"
                        }
                      />
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                {configRows?.[rowIndex]?.editable == true ? (
                  <>
                    <TableCell sx={{ width: 10, paddingRight: "4px" }}>
                      <button
                        onClick={() => onEdit && onEdit(row)}
                        style={{
                          backgroundColor: "#FFF",
                          color: "#1D2432",
                          padding: "8px 16px",
                          borderRadius: "4px",
                          border: "1px solid #CACDD5",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <EditOutlined fontSize="small" />
                        <span>Editar</span>
                      </button>
                    </TableCell>
                    {configRows?.[rowIndex]?.deletable && (
                      <TableCell sx={{ width: 10, paddingLeft: "4px" }}>
                        <button
                          onClick={() => onDelete && onDelete(row)}
                          style={{
                            backgroundColor: "#FFF",
                            color: "#1D2432",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            border: "1px solid #CACDD5",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <DeleteOutline fontSize="small" />
                        </button>
                      </TableCell>
                    )}
                  </>
                ) : (
                  <TableCell colSpan={2} sx={{ width: 20 }}>
                    <button
                      onClick={() => onDuplicate && onDuplicate(row)}
                      style={{
                        backgroundColor: "#FFF",
                        color: "#1D2432",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "1px solid #CACDD5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        width: "100%",
                      }}
                    >
                      <FileCopyOutlined fontSize="small" />
                      <span>Duplicar</span>
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            color: "#8A8A8A",
          }}
        >
          {displayText}
        </Typography>
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor: "#fff", // Cor de fundo padrão branca para todas as páginas
              color: "#101213",
              borderRadius: 1,
              border: "1px solid #CACDD5",
            },
            "& .MuiPaginationItem-previousNext": {
              backgroundColor: "#fff",
              color: "#101213",
              borderRadius: "4px", // Borda arredondada para Previous e Next
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#19B394",
              border: "none",
              color: "#fff",
            },
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default BATable;