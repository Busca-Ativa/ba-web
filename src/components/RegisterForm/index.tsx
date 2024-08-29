"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AuthService } from "@/services/auth/auth";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    code: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.register(formData);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message);
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
          Cadastre-se!
        </div>
      </div>
      <form
        className="form w-full flex-col justify-start items-start gap-2.5 flex"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="name"
          >
            Nome
          </label>
          <input
            type="text"
            id="name"
            placeholder="Nome"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="last_name"
          >
            Último Nome
          </label>
          <input
            type="text"
            id="last_name"
            placeholder="Último Nome"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-[4px] w-full">
          <label
            className="h-[21px] justify-start items-center gap-0.5 inline-flex text-black font-poppins text-[12px] font-semibold leading-[21px]"
            htmlFor="id_institution"
          >
            Cód. Instituição
          </label>
          <input
            type="text"
            id="code"
            placeholder="Código da Instituição"
            className="border border-neutral-light rounded-md px-[16px] py-[10px] text-[14px]"
            value={formData.code}
            onChange={handleChange}
            required
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
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="self-stretch h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[#13866F] rounded justify-center items-center gap-3 inline-flex"
        >
          <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
            {loading ? "Cadastrando..." : "Cadastre-se"}
          </div>
        </button>
      </form>
      <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
        <div className="grow shrink basis-0 h-[0px] border border-[#d6d6d6]"></div>
        <div className="text-center text-[#a5a5a5] text-xs font-normal font-['Poppins'] leading-[18px]">
          Já tem conta?
        </div>
        <div className="grow shrink basis-0 h-[0px] border border-[#d6d6d6]"></div>
      </div>
      <button className="self-stretch h-[41px] px-4 py-2 bg-[#ffe9cc] hover:bg-[#f0dbc0] rounded justify-center items-center gap-3 inline-flex">
        <a
          href="/"
          className="text-[#ff9814] text-sm font-semibold font-['Source Sans Pro'] leading-[18px]"
        >
          Entrar
        </a>
      </button>
    </div>
  );
};

export default RegisterForm;
