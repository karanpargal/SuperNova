"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "@/utils/context/TokenContext";
import Link from "next/link";
import Image from "next/image";
import { useWalletContext } from "@/utils/context/WalletContext";

export const Hero: React.FC = () => {
  const { walletConnected } = useWalletContext();
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
    <section
      className={`w-full flex flex-col mx-auto text-center tracking-wide gap-y-10 md:py-40 px-12 ${
        walletConnected ? "bg-white" : "bg-app-night"
      }h-screen`}
    >
      <div className="absolute inset-0 z-0 bg-transparent overflow-hidden hidden md:block">
        <div className="absolute top-1/2 sm:mt-40 xl:mt-1 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-move-lines"></div>
      </div>
      <div className="md:flex md:flex-nowrap flex-wrap flex items-center justify-center gap-2 md:gap-10  mx-auto">
        {/* Adjust image sizes for smaller screens */}
        {walletConnected ? (
          <Image
            className="sm:h-56 sm:w-56"
            src={"/assets/icons/red-figure1.svg"}
            alt="figure"
            width={150}
            height={100}
          />
        ) : (
          <Image
            className="sm:h-56 sm:w-56"
            src={"/assets/icons/figure1.svg"}
            alt="figure"
            width={150}
            height={100}
          />
        )}

        <div
          className={`flex flex-col text-xl md:text-6xl gap-y-3 max-w-4xl ${
            walletConnected ? "text-app-secondary" : "text-app-gray"
          }`}
        >
          <h1 className="md:text-6xl text-lg font-medium">
            Welcome to{" "}
            <span
              className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${
                walletConnected
                  ? "from-[#C0C0C0] via-[#111821] to-[#1d2a3a]"
                  : "from-[#C0C0C0] via-[#9a9a9a] to-[#9a9a9a]"
              } animate-sparkle`}
            >
              SupraNova
            </span>
            <span className="block md:text-3xl text-sm font-medium">
              Your all in one AI Agent
            </span>
          </h1>
          <p
            className={`text-sm sm:text-lg md:text-3xl ${
              walletConnected ? "text-app-gunmetal/50" : "text-app-gray/60"
            }`}
          >
            Connect your Twitter account to get started with SupraNova AI Agent
          </p>
        </div>
        {/* Adjust image sizes for smaller screens */}
        {walletConnected ? (
          <Image
            className="sm:h-56 sm:w-56"
            src={"/assets/icons/red-figure2.svg"}
            alt="figure"
            width={150}
            height={100}
          />
        ) : (
          <Image
            className="sm:h-56 sm:w-56"
            src={"/assets/icons/figure3.svg"}
            alt="figure"
            width={150}
            height={100}
          />
        )}
      </div>

      {hasToken ? (
        <Link href="/bot-token">
          <Button
            type="button"
            className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
              walletConnected
                ? "hover:ring-app-crimson"
                : "hover:ring-purple-500"
            } md:w-96 w-64 mx-auto md:mt-10 mt-6`}
          >
            <span
              className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
                walletConnected
                  ? "from-white via-app-crimson to-pink-950"
                  : "from-blue-600 via-purple-600 to-pink-700"
              }`}
            ></span>
            <span
              className={`absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 ${
                walletConnected ? "bg-white" : "bg-pink-500 "
              }rounded-full opacity-30 group-hover:rotate-90 ease`}
            ></span>
            <span className="relative text-white">Launch App</span>
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => {
            handleLogin();
          }}
          type="button"
          className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
            walletConnected ? "hover:ring-app-crimson" : "hover:ring-purple-500"
          } md:w-96 w-64 mx-auto md:mt-10 mt-6`}
        >
          <span
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${
              walletConnected
                ? "from-white via-app-crimson to-pink-950"
                : "from-blue-600 via-purple-600 to-pink-700"
            }`}
          ></span>
          <span
            className={`absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 ${
              walletConnected ? "bg-white" : "bg-pink-500 "
            }rounded-full opacity-30 group-hover:rotate-90 ease`}
          ></span>
          <span className="relative text-white"> Connect Twitter</span>
        </Button>
      )}
    </section>
  );
};
