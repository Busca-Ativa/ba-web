"use client";

import {
  ContentPasteSearchOutlined,
  DashboardOutlined,
  DomainRounded,
  EventNoteOutlined,
  Groups2Outlined,
  LogoutOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import "./style.css";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const SideBar = ({ user, activePage }: { user: any; activePage: string }) => {
  const [expanded, setExpanded] = useState(false);

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
      <div>
        <div className="group flex flex-col gap-[10px] mt-[69.5px]">
          <span>Administrativo</span>
          <ul className="flex flex-col gap-2">
            <li className={activePage === "dashboard" ? "active" : ""}>
              <Link href="/admin/dashboard">
                <div className="flex items-center gap-2">
                  <DashboardOutlined />
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li className={activePage === "instituicoes" ? "active" : ""}>
              <Link href="/admin/instituicoes">
                <div className="flex items-center gap-2">
                  <DomainRounded />
                  <span>Instituições</span>
                </div>
              </Link>
            </li>
            <li className={activePage === "usuarios" ? "active" : ""}>
              <Link href="/admin/usuarios">
                <div className="flex items-center gap-2">
                  <Groups2Outlined />
                  <span>Usuários</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
        <div className="group flex flex-col gap-[10px] mt-[28px]">
          <span>Pesquisas</span>
          <ul className="flex flex-col gap-2">
            <li className={activePage === "formularios" ? "active" : ""}>
              <Link href="/admin/formularios">
                <div className="flex items-center gap-2">
                  <ContentPasteSearchOutlined />
                  <span>Formulários</span>
                </div>
              </Link>
            </li>
            <li className={activePage === "eventos" ? "active" : ""}>
              <Link href="/admin/eventos">
                <div className="flex items-center gap-2">
                  <EventNoteOutlined />
                  <span>Eventos</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="group absolute bottom-[25px]">
        <ul className="flex flex-col gap-2">
          <li>
            <Link href="/admin/configuracoes">
              <div className="flex items-center gap-2">
                <SettingsOutlined />
                <span>Configurações</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/logout">
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
