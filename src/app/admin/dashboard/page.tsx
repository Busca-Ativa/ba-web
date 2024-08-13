import SideBar from "@/components/Sidebar";
import "./style.css";
import Card from "@/components/Dashboard/Card";

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
      </div>
    </div>
  );
};

export default Dashboard;
