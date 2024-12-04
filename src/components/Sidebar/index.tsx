"use client";

import {
  ContentPasteSearchOutlined,
  DashboardOutlined,
  Diversity3Outlined,
  DomainRounded,
  EventNoteOutlined,
  EventOutlined,
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

import { useDispatch } from "react-redux";

import { AuthService } from "@/services/auth/auth";

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
        {role == "coordinator" && (
          <>
            <div className="group flex flex-col gap-[10px]">
              <span>Administrativo</span>
              <ul className="flex flex-col gap-2">
                <li className={activePage === "dashboard" ? "active" : ""}>
                  <Link style={{ width: "100%" }} href="/coordinator/dashboard">
                    <div className="flex items-center gap-2">
                      <DashboardOutlined />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                </li>
                <li className={activePage === "unidades" ? "active" : ""}>
                  <Link style={{ width: "100%" }} href="/coordinator/unidades">
                    <div className="flex items-center gap-2">
                      <DomainRounded />
                      <span>Unidades</span>
                    </div>
                  </Link>
                </li>
                <li className={activePage === "usuarios" ? "active" : ""}>
                  <Link style={{ width: "100%" }} href="/coordinator/usuarios">
                    <div className="flex items-center gap-2">
                      <Groups2Outlined />
                      <span>Usuários</span>
                    </div>
                  </Link>
                </li>
                <li className={activePage === "times" ? "active" : ""}>
                  <Link style={{ width: "100%" }} href="/coordinator/times">
                    <div className="flex items-center gap-2">
                      <Diversity3Outlined />
                      <span>Times</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="group flex flex-col gap-[10px] mt-[28px]">
              <span>Pesquisa</span>
              <ul className="flex flex-col gap-2">
                <li className={activePage === "formularios" ? "active" : ""}>
                  <Link
                    style={{ width: "100%" }}
                    href="/coordinator/formularios"
                  >
                    <div className="flex items-center gap-2">
                      <ContentPasteSearchOutlined />
                      <span>Formulários</span>
                    </div>
                  </Link>
                </li>
                <li className={activePage === "secoes" ? "active" : ""}>
                  <Link style={{ width: "100%" }} href="/coordinator/eventos">
                    <div className="flex items-center gap-2">
                      <EventOutlined />
                      <span>Eventos</span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
        {role == "supervisor" && (
          <>
          <div className="group flex flex-col gap-[10px]">
            <span>Administrativo</span>
            <ul className="flex flex-col gap-2">
              <li className={activePage === "dashboard" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/supervisor/dashboard">
                  <div className="flex items-center gap-2">
                    <DashboardOutlined />
                    <span>Dashboard</span>
                  </div>
                </Link>
              </li>
              <li className={activePage === "usuarios" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/supervisor/usuarios">
                  <div className="flex items-center gap-2">
                    <Groups2Outlined />
                    <span>Usuários</span>
                  </div>
                </Link>
              </li>
              <li className={activePage === "times" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/supervisor/times">
                  <div className="flex items-center gap-2">
                    <Diversity3Outlined />
                    <span>Times</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
          <div className="group flex flex-col gap-[10px] mt-[28px]">
            <span>Pesquisa</span>
            <ul className="flex flex-col gap-2">
              <li className={activePage === "formularios" ? "active" : ""}>
                <Link
                  style={{ width: "100%" }}
                  href="/coordinator/formularios"
                >
                  <div className="flex items-center gap-2">
                    <ContentPasteSearchOutlined />
                    <span>Formulários</span>
                  </div>
                </Link>
              </li>
              <li className={activePage === "secoes" ? "active" : ""}>
                <Link style={{ width: "100%" }} href="/supervisor/eventos">
                  <div className="flex items-center gap-2">
                    <EventOutlined />
                    <span>Eventos</span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </>
        )}
        {role == "editor" && (
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
        )}
      </div>
      <div className="group absolute bottom-[25px]">
        <ul className="flex flex-col gap-2">
          <li className={activePage === "config" ? "active" : ""}>
            <Link style={{ width: "100%" }} href="/admin/config">
              <div className="flex items-center gap-2">
                <SettingsOutlined />
                <span>Configurações</span>
              </div>
            </Link>
          </li>
          <li>
            <Link style={{ width: "100%" }} href="/">
              <div className="flex items-center gap-2">
                <LogoutOutlined />
                <button
                  onClick={() => {
                    localStorage.clear();
                    AuthService.logout();
                  }}
                >
                  Sair
                </button>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
