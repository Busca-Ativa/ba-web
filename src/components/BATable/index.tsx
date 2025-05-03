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
import React, { useState, useEffect } from "react";
import Status from "../Status";
import { usePathname } from "next/navigation";
import ButtonActions from "./ButtonActions";
import notFound from "@/assets/status/not-found.png";
import Image from "next/image";

interface Column {
  id: string;
  label: string;
  numeric: boolean;
}

interface Config {
  editable?: boolean;
  deletable?: boolean;
  duplicable?: boolean;
  insertable?: boolean;
  analyseble?: boolean;
}

interface InsertsSelected {
  id: string;
  selected: boolean;
}

interface BATableProps {
  columns: Column[];
  initialRows: Record<string, string | number>[];
  insertsSelected?: InsertsSelected[];
  // configRows?: Config[];
  onEdit?: (row: Record<string, string | number>) => void;
  onDelete?: (row: Record<string, string | number>, rowIndex: number) => void;
  onDuplicate?: (
    row: Record<string, string | number>,
    rowIndex: number
  ) => void;
  onInsert?: (selectedId: string) => void;
  onAnalyse?: (row: Record<string, string | number>) => void;
  onApprove?: (row: Record<string, string | number>, rowIndex: number) => void;
  onDisapprove?: (
    row: Record<string, string | number>,
    rowIndex: number
  ) => void;
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
  insertsSelected,
  onEdit,
  onDelete,
  onInsert,
  onDuplicate,
  onAnalyse,
  onApprove,
  onDisapprove,
}) => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string | undefined>(columns[0]?.id);
  const [rows, setRows] = useState<any>(initialRows);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pathname = usePathname();
  // Pega o último segmento da rota
  const activePage = pathname.split("/").filter(Boolean).pop();

  useEffect(() => {
    setRows(initialRows);
  }, [initialRows]);

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
    <>
      {rows.length === 0 && (
        <div className="flex justify-center items-center flex-col gap-4 mt-24">
          <Image
            src={notFound}
            alt="Nenhum registro encontrado"
            className="w-64"
          />
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 20,
              fontWeight: "bold",
              color: "#6A6A6A",
            }}
          >
            Nenhum registro encontrado
          </Typography>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontSize: 16,
              color: "#8A8A8A",
            }}
          >
            Adicione um novo item para aparecer aqui.
          </Typography>
        </div>
      )}
      {rows.length > 0 && (
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
                  <TableCell sx={{ padding: 0 }}></TableCell>
                  <TableCell sx={{ padding: 0 }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row: any, rowIndex: number) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => {
                      // console.log("Clicou");
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {column.id === "status" ? (
                          <Status
                            status={row[column.id] as string}
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
                        ) : column.id == "progress" ? (
                          <div className="flex items-center">
                            <div className="w-3/4 h-5 bg-[#F1F3F9]">
                              <div
                                className="h-5 bg-[#EE8D10]"
                                style={{
                                  width: `${
                                    (row[column.id].split("/")[0] /
                                      row[column.id].split("/")[1]) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="ml-2 text-xs">{row[column.id]}</div>
                          </div>
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    ))}
                    {rows[rowIndex]?.config ? (
                      <ButtonActions
                        config={rows[rowIndex]?.config}
                        row={row}
                        rowIndex={rowIndex}
                        actions={{
                          onEdit,
                          onAnalyse,
                          onDelete,
                          onInsert,
                          onDuplicate,
                          onApprove,
                          onDisapprove,
                          insertsSelected,
                        }}
                      />
                    ) : (
                      <TableCell colSpan={2} sx={{ width: 20 }}>
                        <div className="w-full flex justify-end">
                          {/* Botões de adicionar/remover já estão no mapeamento */}
                        </div>
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
      )}
    </>
  );
};

export default BATable;
