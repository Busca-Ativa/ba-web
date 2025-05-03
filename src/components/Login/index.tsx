"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthService } from "@/services/auth/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = "Login | Busca Ativa";
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = await AuthService.login(email, password);
      const token = auth.data.access_token;
      const decoded: any = jwtDecode(token);
      const role = decoded.role;
      const userId = decoded.sub.id;

      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", userId);
      }

      if (role == "editor") {
        router.push("/editor/formularios");
        return;
      }
      if (role == "superuser") {
        router.push("/admin/dashboard");
        return;
      } else {
        router.push(`/${role}/dashboard`);
        return;
      }
    } catch (err) {
      setError(
        "Erro ao realizar login. Verifique suas credenciais e tente novamente."
      );
      toast.error(
        "Erro ao realizar login. Verifique suas credenciais e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[400px] h-fit px-[25px] py-[30px] bg-[#fefefe] rounded-[15px] shadow flex-col justify-start items-start gap-[25px] inline-flex">
      <div className="self-stretch justify-start items-center gap-[5px] inline-flex">
        <Image
          className="w-10 h-10"
          src="/vercel.svg"
          alt="Logo"
          width={40}
          height={40}
        />
      </div>
      <div className="self-stretch h-[38px] flex-col justify-start items-start gap-[5px] flex">
        <div className="text-[#0e1113] text-[22px] font-bold font-['Poppins'] leading-[38px]">
          Bem-vindo de volta!
        </div>
      </div>
      <div className="form w-full flex-col justify-start items-start gap-2.5 flex">
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            type="text"
            id="email"
            placeholder="E-mail"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            type="password"
            id="password"
            placeholder="Senha"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="w-full flex justify-end mt-[10px]">
            <a
              href="#"
              className="text-[#19b394] text-[12px] font-normal font-['Poppins'] leading-[18px]"
            >
              Esqueceu a senha?
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="self-stretch h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[#13866F] rounded justify-center items-center gap-3 inline-flex"
      >
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
            Entrar
          </div>
        )}
      </button>
      <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 h-[0px] border border-[#d6d6d6]"></div>
        <div className="text-center text-[#a5a5a5] text-xs font-normal font-['Poppins'] leading-[18px]">
          Não tem conta?
        </div>
        <div className="grow shrink basis-0 h-[0px] border border-[#d6d6d6]"></div>
      </div>
      <button className="self-stretch h-[41px] px-4 py-2 bg-[#ffe9cc] hover:bg-[#f0dbc0] rounded justify-center items-center gap-3 inline-flex">
        <a
          href="/register"
          className="text-[#ff9814] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
        >
          Cadastre-se
        </a>
      </button>
    </div>
  );
};

export default Login;
