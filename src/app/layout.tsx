"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pega o último segmento da rota
  const activePage = pathname.split("/").filter(Boolean).pop();

  return (
    <html lang="en">
      <head>
        <title>Busca Ativa</title>
      </head>
      <body
        className={inter.className}
        style={{
          background:
            pathname !== "/" && pathname !== "/register"
              ? "#FEFEFE"
              : "#F7FAF9",
        }}
      >
        <div className="flex h-screen">
          {pathname !== "/" &&
            pathname !== "/register" &&
            !pathname.includes("/analise/") &&
            !pathname.includes("/agente/") && (
              <SideBar user={""} activePage={activePage || "dashboard"} />
            )}
          <div className="flex flex-col flex-grow h-full overflow-auto">
            <Provider store={store}>{children}</Provider>
          </div>
        </div>
      </body>
    </html>
  );
}
