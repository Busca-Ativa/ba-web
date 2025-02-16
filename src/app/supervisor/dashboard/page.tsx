"use client";

import SideBar from "@/components/Sidebar";
import "./style.css";
import Card from "@/components/Dashboard/Card";
import WeekChart from "@/components/Dashboard/WeekChart";
import Legend from "@/components/Dashboard/Legend";
import MonthChart from "@/components/Dashboard/MonthChart";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";

const Dashboard = () => {
  const cards = [
    {
      key: 1,
      title: "Quant. Times",
      content: "4 Times",
      bgColor: "--primary-lighter",
      textColor: "--primary-dark",
    },
    {
      key: 2,
      title: "Quant. Usuários",
      content: "50 Usuários",
      bgColor: "--secondary-lighter",
      textColor: "--secondary-dark",
    },
    {
      key: 3,
      title: "Quant. Eventos (Total)",
      content: "26 Eventos",
      bgColor: "--primary-lighter",
      textColor: "--primary-dark",
    },
    {
      key: 4,
      title: "Quant. Coletas (Total)",
      content: "102 Coletas",
      bgColor: "--secondary-lighter",
      textColor: "--secondary-dark",
    },
  ];

  const router = useRouter();
  const [pass, setPass] = useState(false);

  useEffect(() => {
    const token = nookies.get(null).access_token;
    if (!token) {
      router.push("/");
    } else {
      setPass(true);
    }
  }, [router]);

  return (
    <>
      {pass && (
        <>
          <div className="dashboard w-[100%] h-[100vh px-[45px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <PageTitle title="Painel de Monitoramento" />
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
                    <MonthChart />
                  </div>
                </div>
                <div className="chart flex-1 flex flex-col gap-1">
                  <h3 className="font-[poppins] text-lg 2xl:text-xl font-bold leading-[32px]">
                    Coletas da Semana
                  </h3>
                  <div>
                    <WeekChart />
                    <Legend
                      colors={[
                        "#B070F0",
                        "#EF4838",
                        "#62ACED",
                        "#F99C34",
                        "#B3E6F5",
                        "#40C156",
                        "#CDA6FF",
                      ]}
                      values={["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]}
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
