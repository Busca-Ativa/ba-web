"use client";

import { useRouter } from "next/navigation";
import api from "@/services/api";
import { getEstadoById, getCidadeById } from "@/services/ibge/api";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Button } from "@mui/material";
import { HowToReg } from "@mui/icons-material";
import BATable from "@/components/BATable";
import NewInstitutionModal from "@/components/Modals/NewInstitution";
import { toast, ToastContainer } from "react-toastify";
import { translateRole } from "@/utils/index";
import CoordinatorEditUser from "@/components/Modals/CoordinatorEditUser";

interface Row {
  [key: string]: string | number;
}

const UsuariosAdmin = () => {
  const router = useRouter();
  const [pass, setPass] = useState(false);
  const [userRows, setUserRows] = useState<any[]>([]);
  const [approvalRows, setApprovalRows] = useState<any[]>([]);
  const [unitInfo, setUnitInfo] = useState("Loading...");

  const [showApprovalPage, setShowApprovalPage] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const handleOpen = () => setEditModalOpen(true);
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
        "/supervisor/user/active",
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
            unit: user.unit ? user.unit.name : "Pertence a essa unidade",
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
      const response = await api.delete(`/supervisor/user/${row.id}`, {
        withCredentials: true,
      });
      const dataFromApi = response.data;
      if (response.status === 200) {
        const newApprovalRows = [...approvalRows];
        newApprovalRows.splice(rowIndex, 1);
        setApprovalRows(newApprovalRows);
        toast.success(dataFromApi.message);
      }
    } catch (error) {
      console.log(error);
    }
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
      try {
        const response = await api.get("/supervisor/users?active=1", {
          withCredentials: true,
        });
        const dataFromApi = response.data;
        const rows = dataFromApi.data.map((user: any) => {
          return {
            ...user,
            unit: user.unit ? user.unit.name : "Pertence a essa instituição",
            role: translateRole(user.role),
            config: { analysable: false, editable: true, deletable: true },
          };
        });
        setUserRows(rows);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (showApprovalPage) {
      const getData = async () => {
        try {
          const response = await api.get("/supervisor/users?active=0", {
            withCredentials: true,
          });
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
        }
      };
      getData();
    }
  }, [showApprovalPage]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/all/user", { withCredentials: true });
        const dataFromApi = response.data;
        const unit = dataFromApi.unit;
        setUnitInfo(unit.name);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleEdit = async (row: Record<string, string | number>) => {
    api
      .patch(
        `/supervisor/user`,
        {
          body: {
            id_user: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            name: "string",
            last_name: "string",
            email: "string",
            identificator: "string",
            role: "string",
            active: 0,
            id_institution: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            id_unit: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          },
        },
        { withCredentials: true }
      )
      .then((response) => {});
  };

  const columns = [
    { id: "name", label: "Nome", numeric: false },
    { id: "identificator", label: "Cód. Id.", numeric: false },
    { id: "unit", label: "Unidade", numeric: false },
    { id: "role", label: "Cargo", numeric: false },
  ];

  return (
    <>
      {!showApprovalPage && (
        <>
          <div className="w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-1">
            <div className="flex justify-between mb-7 items-center">
              <div className="flex flex-col gap-1">
                <h1>Usuários</h1>
                <h2 className="text-[#575757] text-sm font-normal font-['Poppins'] leading-[21px]">
                  {unitInfo}
                </h2>
              </div>
              <Button
                onClick={handleShowApproval}
                className="h-[41px] px-4 py-2 bg-[#19B394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white"
              >
                <HowToReg />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Aprovar Usuário
                </div>
              </Button>
            </div>
            <BATable
              columns={columns}
              initialRows={userRows}
              onEdit={handleOpen}
              onDelete={(
                row: Record<string, string | number>,
                rowIndex: number
              ) => {
                handleApproval(row, rowIndex, false);
              }}
            />
          </div>
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
      {/* <CoordinatorEditUser onClose={handleClose} open={isEditModalOpen} onSubmit={()=>{}}/>
      <ToastContainer/> */}
    </>
  );
};

export default UsuariosAdmin;
