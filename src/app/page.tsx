import Login from "@/components/Login";
import ToastContainerWrapper from "@/components/ToastContainerWrapper";

const Home = () => {
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <Login />
      <ToastContainerWrapper />
    </div>
  );
};

export default Home;
