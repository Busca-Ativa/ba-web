import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
  TableSortLabel,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

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

interface Column {
  id: string;
  label: string;
  numeric: boolean;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: Column[];
  showActions?: boolean;
}

const SkeletonTable = ({
  rows = 10,
  columns = [],
  showActions = false,
}: SkeletonTableProps) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <TableContainer component={Paper}>
          <Table>
            {/* Table Head (Skeleton Headers) */}
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    <TableSortLabel disabled>
                      <Skeleton variant="text" width={80} height={32} />
                    </TableSortLabel>
                  </TableCell>
                ))}
                {/* Empty Cells for Actions */}
                {showActions && (
                  <>
                    <TableCell sx={{ padding: 0 }} />
                    <TableCell sx={{ padding: 0 }} />
                  </>
                )}
              </TableRow>
            </TableHead>

            {/* Table Body (Skeleton Rows) */}
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.id === "status" ? (
                        <Skeleton variant="rounded" width={80} height={24} />
                      ) : column.id === "progress" ? (
                        <Box display="flex" alignItems="center">
                          <Skeleton
                            variant="rectangular"
                            width="75%"
                            height={20}
                          />
                          <Skeleton
                            variant="text"
                            width={40}
                            height={16}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      ) : (
                        <Skeleton variant="text" width="100%" height={24} />
                      )}
                    </TableCell>
                  ))}
                  {/* Action Buttons Placeholder */}
                  {showActions && (
                    <TableCell colSpan={2} sx={{ width: 20 }}>
                      <Box display="flex" justifyContent="flex-end">
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ mx: 1 }}
                        />
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ mx: 1 }}
                        />
                        <Skeleton
                          variant="circular"
                          width={32}
                          height={32}
                          sx={{ mx: 1 }}
                        />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
      {/* Pagination Placeholder */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="16px"
      >
        <Typography sx={{ fontSize: 16, color: "#8A8A8A" }}>
          <Skeleton variant="text" width={120} height={24} />
        </Typography>
        <Skeleton variant="rectangular" width={200} height={32} />
      </Box>
    </>
  );
};

export default SkeletonTable;
