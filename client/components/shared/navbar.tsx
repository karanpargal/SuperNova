"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
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
    <section className="">
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
        <Button className="text-xl text-app-pink rounded-full py-6 border border-app-dark-purple">
          Connect Twitter
        </Button>
      </nav>
    </section>
  );
};
