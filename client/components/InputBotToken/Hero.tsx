"use client";

import { InputForm } from "./InputForm";
import Image from "next/image";
import { useWalletContext } from "@/utils/context/WalletContext";
import Link from "next/link";

export const Hero: React.FC = () => {
  const { walletConnected } = useWalletContext();

  return (
    <section
      className={`flex flex-col mx-auto ${
        walletConnected ? "bg-white" : "bg-app-night "
      }h-screen`}
    >
      {!walletConnected ? (
        <div className="px-12 bg-app-night">
          <div className="flex items-center justify-between py-1 sm:hidden">
            <Image
              src={"/assets/logo.svg"}
              alt="SUPRANOVA"
              height={50}
              width={50}
            />
            <Link href="/profile" className="text-black">
              Profile
            </Link>
          </div>
          <div className="flex flex-col gap-y-2 md:px-28 px-6 sm:mt-12 py-3 justify-center mx-auto text-center">
            <h1 className="md:text-3xl text-xl text-white font-medium">
              Dive into magic
            </h1>
            <p className="md:text-lg text-base text-white/70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sed
            </p>
          </div>
          <div>
            <InputForm />
          </div>
        </div>
      ) : (
        <div className="px-12 bg-white">
          <div className="flex items-center justify-between py-2 md:hidden">
            <div className="flex items-center gap-x-1">
              <Image
                src={"/assets/supra_logo.png"}
                alt="SUPRA"
                height={25}
                width={25}
              />
              <h1 className="text-app-gunmetal text-xl tracking-wide">NOVA</h1>
            </div>
            <Link href="/profile" className="text-black">
              Profile
            </Link>
          </div>
          <div className="flex flex-col gap-y-2 md:px-28 px-6 sm:mt-12 py-3 justify-center mx-auto text-center">
            <h1 className="md:text-3xl text-xl text-app-secondary font-medium">
              Dive into magic
            </h1>
            <p className="md:text-lg text-base text-app-gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              sed
            </p>
          </div>
          <div>
            <InputForm />
          </div>
        </div>
      )}
    </section>
  );
};
