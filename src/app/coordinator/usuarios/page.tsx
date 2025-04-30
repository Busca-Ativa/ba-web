"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { HowToReg } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { toast } from "react-toastify";
import { translateRole } from "@/utils/index";
import CoordinatorEditUser from "@/components/Modals/CoordinatorEditUser";
import "react-toastify/dist/ReactToastify.css";
import SkeletonTable from "@/components/SkeletonTable";
import PageTitle from "@/components/PageTitle";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

interface Row {
  [key: string]: string | number;
}

const UsuariosAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pass, setPass] = useState(false);
  const [userRows, setUserRows] = useState<any[]>([]);
  const [approvalRows, setApprovalRows] = useState<any[]>([]);

  const [showApprovalPage, setShowApprovalPage] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>({});

  useEffect(() => {
    document.title = "Usuários | Busca Ativa";
  }, []);

  const handleOpen = (user: any) => {
    console.log("user", user);
    setSelectedUser({
      id: user.id,
      identificador:
        user.identificator == "Sem código" ? null : user.identificator,
    });
    setEditModalOpen(true);
  };
  const handleClose = () => setEditModalOpen(false);

  const handleShowApproval = () => setShowApprovalPage(true);
  const handleHideApproval = () => setShowApprovalPage(false);

  const handleApproval = async (
    row: Record<string, string | number>,
    rowIndex: number,
    approval: boolean
  ) => {
    try {
      const response = await api.post(
        "/coordinator/user/active",
        { id_user: row.id, active: approval },
        { withCredentials: true }
      );
      const dataFromApi = response.data;
      if (response.status === 200) {
        if (approval) {
          const newRows = [...userRows];
          const user: any = dataFromApi.data;
          newRows.push({
            ...user,
            unit: user.unit ? user.unit.name : "Pertence a essa instituição",
            role: translateRole(user.role),
            config: { analysable: false, editable: true, deletable: true },
          });
          setUserRows(newRows);
          const newApprovalRows = [...approvalRows];
          newApprovalRows.splice(rowIndex, 1);
          setApprovalRows(newApprovalRows);
          toast.success(dataFromApi.message);
        } else {
          const newRows = [...userRows];
          const deactivatedUser = newRows.splice(rowIndex, 1);
          setUserRows(newRows);
          const newApprovalRows = [...approvalRows];
          newApprovalRows.push(deactivatedUser);
          setApprovalRows(newApprovalRows);
          toast.success(dataFromApi.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    try {
      const response = await api.delete(`/coordinator/user/${row.id}`, {
        withCredentials: true,
      });
      const dataFromApi = response.data;
      if (response.status === 200) {
        const newApprovalRows = [...approvalRows];
        newApprovalRows.splice(rowIndex, 1);
        setApprovalRows(newApprovalRows);
        toast.success("Usuário deletado com sucesso!");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const semiDelete = async (
    row: Record<string, string | number>,
    rowIndex: number
  ) => {
    setSelectedUser({ row, rowIndex });
    setConfirmationModalOpen(true);
  };

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/coordinator/institution/users", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((user: any) => {
          return {
            ...user,
            identificator: user.identificator
              ? user.identificator
              : "Sem código",
            unit: user.unit ? user.unit.name : "Pertence a essa instituição",
            role: translateRole(user.role),
            config: { analysable: false, editable: true, deletable: true },
          };
        });
        setUserRows(rows);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          "/coordinator/institution/users?active=0",
          { withCredentials: true }
        );
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((user: any) => {
          console.log(user);
          return {
            ...user,
            unit: user.unit ? user.unit.name : "Pertence a essa instituição",
            role: translateRole(user.role),
            config: { disapproved: true, approved: true },
          };
        });
        setApprovalRows(rows);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleEdit = async (row: Record<string, string | number>) => {
    console.log("row", row);
    try {
      const response = await api.patch(
        `/coordinator/user`,
        {
          id_user: row.id,
          identificator: row.identificador,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Usuário editado com sucesso!");
        // Update the userRows state with the edited user
        setUserRows((prevRows) =>
          prevRows.map((user) =>
            user.id === row.id
              ? { ...user, identificator: row.identificator }
              : user
          )
        );
      }
    } catch (error: any) {
      toast.error("Erro ao editar usuário.");
      console.log(error);
    }
  };

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "identificator", label: "Cód. Id.", numeric: false },
    { id: "unit", label: "Unidade", numeric: false },
    { id: "role", label: "Cargo", numeric: false },
  ];

  const onAdd = (newInstitution: any) => {
    setData((prev: any) => [...prev, newInstitution]);
  };

  return (
    <>
      {!showApprovalPage && (
        <>
          <div className="w-[100%] px-[45px] py-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <PageTitle title="Usuários" />
              <Button
                onClick={handleShowApproval}
                className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
              >
                <HowToReg />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Aprovar Usuário
                </div>
              </Button>
            </div>
            {loading && <SkeletonTable columns={columns} showActions={true} />}
            {!loading && (
              <BATable
                columns={columns}
                initialRows={userRows}
                onEdit={handleOpen}
                onDelete={(
                  row: Record<string, string | number>,
                  rowIndex: number
                ) => {
                  semiDelete(row, rowIndex);
                }}
              />
            )}
          </div>
          {confirmationModalOpen && (
            <Dialog
              open={confirmationModalOpen}
              onClose={() => setConfirmationModalOpen(false)}
            >
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Tem certeza de que deseja excluir este usuário?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setConfirmationModalOpen(false);
                    setSelectedUser({});
                  }}
                  variant="outlined"
                  color="error"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={async () => {
                    await handleApproval(
                      selectedUser.row,
                      selectedUser.rowIndex,
                      false
                    );

                    setConfirmationModalOpen(false);
                    setSelectedUser({});
                  }}
                  variant="contained"
                  color="success"
                >
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
      {showApprovalPage && (
        <>
          <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Pedidos de Cadastro</h1>
              <Button
                onClick={handleHideApproval}
                className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
              >
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Voltar
                </div>
              </Button>
            </div>
            <BATable
              columns={columns}
              initialRows={approvalRows}
              onDisapprove={(
                row: Record<string, string | number>,
                rowIndex: number
              ) => {
                handleDelete(row, rowIndex);
              }}
              onApprove={(
                row: Record<string, string | number>,
                rowIndex: number
              ) => {
                handleApproval(row, rowIndex, true);
              }}
            />
          </div>
        </>
      )}

      <CoordinatorEditUser
        onClose={handleClose}
        open={isEditModalOpen}
        onSubmit={handleEdit}
        data={selectedUser}
      />
      <ToastContainerWrapper />
    </>
  );
};

export default UsuariosAdmin;
function setData(arg0: (prev: any) => any[]) {
  throw new Error("Function not implemented.");
}
