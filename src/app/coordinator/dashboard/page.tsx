"use client";

import Card from "@/components/Dashboard/Card";
import MonthChart from "@/components/Dashboard/MonthChart";
import WeekChart from "@/components/Dashboard/WeekChart";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useEffect, useState } from "react";
import "./style.css";

const Dashboard = () => {
  const router = useRouter();
  const [pass, setPass] = useState(false);
  interface DashboardData {
    units_count: number;
    agents_count: number;
    events_count: number;
    month_events_count: number;
    month_gatherings_count: Record<string, number>;
    week_gatherings_count: Record<string, number>;
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [cards, setCards] = useState<
    {
      key: number;
      title: string;
      content: any;
      bgColor: string;
      textColor: string;
    }[]
  >([]);

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  useEffect(() => {
    api
      .get("/coordinator/dashboard")
      .then((response) => {
        const data = response.data.data;
        setDashboardData(data);

        // Define cards based on dashboardData
        setCards([
          {
            key: 1,
            title: "Quant. Unidades",
            content: data.units_count + " unidades",
            bgColor: "--primary-lighter",
            textColor: "--primary-dark",
          },
          {
            key: 2,
            title: "Quant. Agentes",
            content: data.agents_count + " agentes",
            bgColor: "--secondary-lighter",
            textColor: "--secondary-dark",
          },
          {
            key: 3,
            title: "Quant. Eventos (Total)",
            content: data.events_count + " eventos",
            bgColor: "--primary-lighter",
            textColor: "--primary-dark",
          },
          {
            key: 4,
            title: "Quant.Eventos (Julho)",
            content: data.month_events_count + " eventos",
            bgColor: "--secondary-lighter",
            textColor: "--secondary-dark",
          },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      {pass && (
        <>
          <div className="dashboard w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <h1 className="text-3xl 2xl:text-4xl">Painel de Monitoramento</h1>
            <div className="cards w-[100%] flex justify-stretch gap-[20px]">
              {cards.map((card) => (
                <Card
                  key={card.key}
                  title={card.title}
                  content={card.content}
                  bgColor={card.bgColor}
                  textColor={card.textColor}
                />
              ))}
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="font-[poppins] text-2xl 2xl:text-3xl font-bold leading-[32px]">
                Coletas
              </h2>
              <div className="flex gap-8 justify-between">
                <div className="chart flex-1 flex flex-col gap-1">
                  <h3 className="font-[poppins] text-lg 2xl:text-xl font-bold leading-[32px]">
                    Coletas do mês
                  </h3>
                  <div>
                    <MonthChart
                      data={dashboardData?.month_gatherings_count || {}}
                    />
                  </div>
                </div>
                <div className="chart flex-1 flex flex-col gap-1">
                  <h3 className="font-[poppins] text-lg 2xl:text-xl font-bold leading-[32px]">
                    Coletas da Semana
                  </h3>
                  <div>
                    <WeekChart
                      data={dashboardData?.week_gatherings_count || {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
