"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import store from "../../redux/store";

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
      <body
        className={inter.className}
        style={{
          background:
            pathname !== "/" && pathname !== "/register"
              ? "#FEFEFE"
              : "#F7FAF9",
        }}
      >
        <div className="flex">
          {pathname !== "/" &&
            pathname !== "/register" &&
            !pathname.includes("/analise/") && (
              <SideBar user={""} activePage={activePage || "dashboard"} />
            )}
          <Provider store={store}>{children}</Provider>
        </div>
      </body>
    </html>
  );
}
