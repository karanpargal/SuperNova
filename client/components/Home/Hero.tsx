"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";

export const Hero: React.FC = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const handleLogin = async () => {
    try {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/twitter/login`,
        "_blank",
        "width=600,height=700"
      );
      setLoginStatus(true);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== `${process.env.NEXT_PUBLIC_API_URL}`) return;

      const { token, status } = e.data;

      const userId = uuidv4();
      console.log(userId);
      localStorage.setItem("userId", userId);

      if (token) {
        console.log(token);
        console.log(status);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [loginStatus]);

  return (
    <section className="w-full flex flex-col mx-auto text-center tracking-wide gap-y-10 mt-40">
      <div className="absolute inset-0 z-0 bg-transparent overflow-hidden hidden md:block">
        <div className="absolute top-1/2 mt-4 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent animate-move-lines"></div>
      </div>
      <div className="flex flex-col text-app-gray text-6xl gap-y-3 max-w-4xl mx-auto">
        <h1 className="text-gray">
          Welcome to{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C0C0C0] via-[#9a9a9a] to-[#9a9a9a] animate-sparkle">
            SupraNova
          </span>
          Your all in one AI Agent
        </h1>
        <p className="text-app-jet text-3xl">
          Connect your Twitter account to get started with SupraNova AI Agent
        </p>
      </div>
      <Button
        onClick={() => {
          handleLogin();
        }}
        className="relative inline-flex items-center justify-center p-4 px-5 py-6 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 w-96 mx-auto mt-10"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
        <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
        <span className="relative text-white font-medium text-base">
          Connect Twitter
        </span>
      </Button>
    </section>
  );
};
