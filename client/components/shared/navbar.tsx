"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToken } from "@/utils/context/TokenContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { hasToken, setHasToken } = useToken();

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
      if (token) {
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
      <nav className="text-white flex items-center px-12 py-6 justify-between">
        <h1>Logo</h1>
        <ul className="flex items-center gap-x-6 text-lg font-medium bg-app-dark-purple/50 px-10 ml-20 py-4 rounded-full border border-app-pink">
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
          <Button className="text-xl text-app-pink rounded-full py-6 border border-app-dark-purple">
            Launch App
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            className="text-xl text-app-pink rounded-full py-6 border border-app-dark-purple"
          >
            Connect Twitter
          </Button>
        )}
      </nav>
    </section>
  );
};
