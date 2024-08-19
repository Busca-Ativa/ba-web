"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import nookies from "nookies";
import { Add, PlusOne } from "@mui/icons-material";

const InstituicoesAdmin = () => {
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
          <div className="w-[100%] h-[100vh px-[40px] pt-[60px] flex flex-col gap-8 2xl:gap-10">
            <div className="flex justify-between">
              <h1>Instituições</h1>
              <button className="h-[41px] px-4 py-2 bg-[#19b394] hover:bg-[--primary-dark] rounded justify-center items-center gap-3 inline-flex text-white">
                <Add />
                <div className="text-white text-sm font-semibold font-['Source Sans Pro'] leading-[18px]">
                  Nova Instituição
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InstituicoesAdmin;
