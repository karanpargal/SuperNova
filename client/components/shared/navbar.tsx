"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "@/utils/context/TokenContext";
import Image from "next/image";
import { useWalletContext } from "@/utils/context/WalletContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { hasToken, setHasToken } = useToken();
  const { walletConnected } = useWalletContext();

  const handleLogin = async () => {
    try {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}/twitter/login`,
        "_blank",
        "width=600,height=700"
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== `${process.env.NEXT_PUBLIC_API_URL}`) return;

      const { token } = e.data;
      const userId = uuidv4();

      localStorage.setItem("userId", userId);
      if (token) {
        localStorage.setItem("userId", uuidv4());
        localStorage.setItem("token", token);
        setHasToken(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [setHasToken]);

  const navItems = [
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Services",
      url: "/Lending",
    },
    {
      name: "Library",
      url: "/Borrowing",
    },
  ];

  return (
    <section>
      <nav
        className={`flex items-center px-12 py-6 justify-between ${
          walletConnected
            ? "text-app-gunmetal bg-app-white"
            : "bg-app-night text-white"
        }`}
      >
        {walletConnected ? (
          <div className="flex items-center gap-x-1">
            <Image
              src={"/assets/supra_logo.png"}
              alt="SUPRA"
              height={40}
              width={40}
            />
            <h1 className="text-app-gunmetal text-2xl tracking-wide">NOVA</h1>
          </div>
        ) : (
          <Image
            src={"/assets/logo.svg"}
            alt="logo"
            width={100}
            height={100}
            className="md:block hidden"
          />
        )}

        <ul
          className={`flex items-center gap-x-6 text-lg font-medium px-10 ml-20 py-4 rounded-full border ${
            walletConnected
              ? "border-app-crimson bg-app-crimson/20"
              : "bg-app-dark-purple/50 border-app-pink"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link key={item.url} href={item.url}>
                <li
                  className={`cursor-pointer  ${
                    isActive
                      ? "decoration-app-slate underline underline-offset-8"
                      : "text-app-violet"
                  }`}
                >
                  <p>{item.name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
        {hasToken ? (
          <Button
            className={`text-xl rounded-full py-6 border ${
              walletConnected
                ? "border-app-crimson bg-app-crimson/20 text-app-gunmetal"
                : "border-app-pink bg-app-dark-purple text-white"
            }`}
          >
            Launch App
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            className="text-xl text-white rounded-full py-6 border border-app-pink bg-app-dark-purple"
          >
            Connect Twitter
          </Button>
        )}
      </nav>
    </section>
  );
};
