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
      name: "Lend",
      url: "/Lending",
    },
    {
      name: "Borrow",
      url: "/Borrowing",
    },
    {
      name: "Estimate APY",
      url: "/estimate-apy",
    },
    {
      name: "FeedBack",
      url: "/feedback",
    },
  ];

  return (
    <section className="mx-auto">
      <nav className="text-white flex items-center gap-x-40 px-12 py-6 justify-around">
        <h1>Logo</h1>
        <ul className="flex items-center gap-x-6 text-lg font-medium bg-app-dark-purple/50 px-10 py-4 rounded-full border border-app-pink">
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
