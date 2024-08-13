import SideBar from "@/components/Sidebar";
import "./style.css";
import Card from "@/components/Dashboard/Card";
import WeekChart from "@/components/Dashboard/WeekChart";

const Dashboard = () => {
  const cards = [
    {
      key: 1,
      title: "Quant. Instituições",
      content: "4 Instituições",
      bgColor: "--primary-lighter",
      textColor: "--primary-dark",
    },
    {
      key: 2,
      title: "Quant. Usuários",
      content: "124 Usuários",
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
      title: "Quant.Eventos (Julho)",
      content: "5 Eventos",
      bgColor: "--secondary-lighter",
      textColor: "--secondary-dark",
    },
  ];

  return (
    <div className="flex">
      <SideBar user={""} activePage={"dashboard"} />
      <div className="dashboard w-[100%] h-[100vh px-[40px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
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
                Coletas da Semana
              </h3>
              <div>
                <WeekChart />
                <div className="legend">
                  <div className="legend-item">
                    <span className="bg-[#B070F0]"></span>
                    <span>Seg</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#EF4838]"></span>
                    <span>Ter</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#62ACED]"></span>
                    <span>Qua</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#F99C34]"></span>
                    <span>Qui</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#B3E6F5]"></span>
                    <span>Sex</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#40C156]"></span>
                    <span>Sáb</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#CDA6FF]"></span>
                    <span>Dom</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="chart flex-1 flex flex-col gap-1">
              <h3 className="font-[poppins] text-lg 2xl:text-xl font-bold leading-[32px]">
                Coletas da Semana
              </h3>
              <div>
                <WeekChart />
                <div className="legend">
                  <div className="legend-item">
                    <span className="bg-[#B070F0]"></span>
                    <span>Seg</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#EF4838]"></span>
                    <span>Ter</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#62ACED]"></span>
                    <span>Qua</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#F99C34]"></span>
                    <span>Qui</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#B3E6F5]"></span>
                    <span>Sex</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#40C156]"></span>
                    <span>Sáb</span>
                  </div>
                  <div className="legend-item">
                    <span className="bg-[#CDA6FF]"></span>
                    <span>Dom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
