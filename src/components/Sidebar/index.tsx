"use client";

import {
  ContentPasteSearchOutlined,
  DashboardOutlined,
  DomainRounded,
  EventNoteOutlined,
  Groups2Outlined,
  LogoutOutlined,
  Quiz,
  QuizOutlined,
  SettingsOutlined,
  SplitscreenOutlined,
} from "@mui/icons-material";
import "./style.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const SideBar = ({ user, activePage }: { user: any; activePage: string }) => {
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div
      onMouseOver={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="sidebar w-[243px] h-[100vh] py-[25px] pl-[13px] pr-[17px] rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-none bg-[#FEFEFE]"
    >
      <div className="logo flex items-center">
        <Image src="/next.svg" alt="Logo" width={40} height={40} />
        <span className="text-[#19B394] mr-1">Busca</span>
        <span className="text-[#FF9814]">Ativa!</span>
      </div>
      <div className="mt-[69.5px]">
        {role == "admin" && (
          <div className="group flex flex-col gap-[10px]">
            <span>Administrativo</span>
            <ul className="flex flex-col gap-2">
              <li className={activePage === "dashboard" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/admin/dashboard">
                  <div className="flex items-center gap-2">
                    <DashboardOutlined />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li className={activePage === "instituicoes" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/admin/instituicoes">
                  <div className="flex items-center gap-2">
                    <DomainRounded />
                    <span>Instituições</span>
                  </div>
                </Link>
              </li>
              <li className={activePage === "usuarios" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/admin/usuarios">
                  <div className="flex items-center gap-2">
                    <Groups2Outlined />
                    <span>Usuários</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        )}
        <div className="group flex flex-col gap-[10px] mt-[28px]">
          <span>Edição</span>
          <ul className="flex flex-col gap-2">
            <li className={activePage === "formularios" ? "active" : ""}>
              <Link style={{ width: "100%" }} href="/editor/formularios">
                <div className="flex items-center gap-2">
                  <ContentPasteSearchOutlined />
                  <span>Formulários</span>
                </div>
              </Link>
            </li>
            <li className={activePage === "secoes" ? "active" : ""}>
              <Link style={{ width: "100%" }} href="/editor/secoes">
                <div className="flex items-center gap-2">
                  <SplitscreenOutlined />
                  <span>Seções</span>
                </div>
              </Link>
            </li>
            <li className={activePage === "questoes" ? "active" : ""}>
              <Link style={{ width: "100%" }} href="/editor/questoes">
                <div className="flex items-center gap-2">
                  <QuizOutlined />
                  <span>Questões</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="group absolute bottom-[25px]">
        <ul className="flex flex-col gap-2">
          <li>
            <Link style={{ width: "100%" }} href="/admin/configuracoes">
              <div className="flex items-center gap-2">
                <SettingsOutlined />
                <span>Configurações</span>
              </div>
            </Link>
          </li>
          <li>
            <Link style={{ width: "100%" }} href="/logout">
              <div className="flex items-center gap-2">
                <LogoutOutlined />
                <span>Sair</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
