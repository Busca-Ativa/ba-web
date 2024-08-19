import Login from "@/components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <Login />
      <ToastContainer />
    </div>
  );
};

export default Home;
