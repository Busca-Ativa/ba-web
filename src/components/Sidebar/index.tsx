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

const SideBar = ({ user, activePage }: { user: any; activePage: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onMouseOver={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="sidebar w-[243px] h-[100vh] py-[25px] pl-[13px] pr-[17px]  rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-none bg-[#FEFEFE]"
    >
      <div className="logo">
        <Image src="/next.svg" alt="Logo" width={40} height={40} />
        <span className="text-[#19B394] mr-1">Busca</span>
        <span className="text-[#FF9814]">Ativa!</span>
      </div>
      <div>
        <div className="group flex flex-col gap-[10px] mt-[69.5px]">
          <span>Administrativo</span>
          <ul>
            <li className={activePage === "dashboard" ? "active" : ""}>
              <DashboardOutlined />
              <span>Dashboard</span>
            </li>
            <li className={activePage === "instituicoes" ? "active" : ""}>
              <DomainRounded />
              <span>Instituições</span>
            </li>
            <li className={activePage === "usuarios" ? "active" : ""}>
              <Groups2Outlined />
              <span>Usuários</span>
            </li>
          </ul>
        </div>
        <div className="group flex flex-col gap-[10px] mt-[28px]">
          <span>Pesquisas</span>
          <ul>
            <li className={activePage === "formularios" ? "active" : ""}>
              <ContentPasteSearchOutlined />
              <span>Formulários</span>
            </li>
            <li className={activePage === "eventos" ? "active" : ""}>
              <EventNoteOutlined />
              <span>Eventos</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="group absolute bottom-[25px]">
        <ul>
          <li>
            <SettingsOutlined />
            <span>Configurações</span>
          </li>
          <li>
            <LogoutOutlined />
            <span>Configurações</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
