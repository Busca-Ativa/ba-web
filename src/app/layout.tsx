"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/components/Sidebar";
import "./globals.css";
import { Inter } from "next/font/google";
import { FormProvider  } from "@/contexts/FormContext";

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
      <body className={inter.className}>
        <div className="flex">
          {pathname !== "/" && pathname !== "/register" && (
            <SideBar user={""} activePage={activePage || "dashboard"} />
          )}
          <FormProvider >
            {children}
          </FormProvider>
        </div>
      </body>
    </html>
  );
}
