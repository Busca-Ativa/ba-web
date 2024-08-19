"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthService } from "@/services/auth/auth";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    toast.loading("Entrando...");
    try {
      await AuthService.login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      toast.dismiss();
      setError(
        "Erro ao realizar login. Verifique suas credenciais e tente novamente."
      );
      toast.error(error);
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
        <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
          {loading ? "Entrando..." : "Entrar"}
        </div>
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
