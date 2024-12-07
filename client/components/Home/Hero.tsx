"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "@/utils/context/TokenContext";
import Link from "next/link";
import Image from "next/image";

export const Hero: React.FC = () => {
  const { hasToken, setHasToken } = useToken();
  const handleLogin = async () => {
    try {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/twitter/login`,
        "_blank",
        "width=600,height=700"
      );

      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== `${process.env.NEXT_PUBLIC_API_URL}`) return;

      const { token } = e.data;
      if (token) {
        localStorage.setItem("token", token);
        setHasToken(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setHasToken]);

  return (
    <section className="w-full flex flex-col mx-auto text-center tracking-wide gap-y-10 md:mt-40">
      <div className="absolute inset-0 z-0 bg-transparent overflow-hidden hidden md:block">
        <div className="absolute top-1/2 my-8 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-move-lines"></div>
      </div>
      <div className="flex items-center flex-wrap justify-center gap-2 md:gap-10">
        {/* Adjust image sizes for smaller screens */}
        <Image
          className="sm:h-56 sm:w-56"
          src={"/assets/icons/figure1.svg"}
          alt="figure"
          width={150}
          height={100}
        />
        <div className="flex flex-col text-app-gray text-xl sm:text-2xl md:text-6xl gap-y-3 max-w-4xl mx-auto">
          <h1 className="text-gray md:text-6xl text-lg font-medium">
            Welcome to{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C0C0C0] via-[#9a9a9a] to-[#9a9a9a] animate-sparkle">
              SupraNova
            </span>
            <span className="block md:text-3xl text-sm font-medium">
              Your all in one AI Agent
            </span>
          </h1>
          <p className="text-app-jet text-sm sm:text-lg md:text-3xl">
            Connect your Twitter account to get started with SupraNova AI Agent
          </p>
        </div>
        {/* Adjust image sizes for smaller screens */}
        <Image
          className="sm:h-56 sm:w-56"
          src={"/assets/icons/figure3.svg"}
          alt="figure"
          width={150}
          height={100}
        />
      </div>

      {hasToken ? (
        <Link href="/bot-token">
          <Button className="relative inline-flex items-center justify-center p-2 px-3 py-4 md:p-4 md:px-5 md:py-6 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 w-96 mx-auto md:mt-10">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64  mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-white font-medium text-base">
              Launch App
            </span>
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => {
            handleLogin();
          }}
          className="relative inline-flex items-center justify-center p-4 px-5 py-6 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 w-96 mx-auto md:mt-10"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
          <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32  mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
          <span className="relative text-white font-medium text-base">
            Connect Twitter
          </span>
        </Button>
      )}
    </section>
  );
};
