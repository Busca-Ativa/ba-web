import SideBar from "@/components/Sidebar";
import "./style.css";

const Dashboard = () => {
  return (
    <div className="flex">
      <SideBar user={""} activePage={"dashboard"} />
      <div className="dashboard w-[100%] h-[100vh px-[40px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
        <h1 className="text-3xl 2xl:text-4xl">Painel de Monitoramento</h1>
        <div className="cards w-[100%] flex justify-stretch gap-[20px]">
          <div className="card bg-[--primary-lighter] text-[--primary-dark]">
            <span className="text-xl">Quant. Instituições</span>
            <p className="text-2xl">4 Intituições</p>
          </div>
          <div className="card bg-[--secondary-lighter] text-[--secondary-dark]">
            <span className="text-xl">Quant. Usuários</span>
            <p className="text-2xl">124 Usuários</p>
          </div>
          <div className="card bg-[--primary-lighter] text-[--primary-dark]">
            <span className="text-xl">Quant. Eventos (Total)</span>
            <p className="text-2xl">26 Eventos</p>
          </div>
          <div className="card bg-[--secondary-lighter] text-[--secondary-dark]">
            <span className="text-xl">Quant.Eventos (Julho)</span>
            <p className="text-2xl">5 Eventos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
