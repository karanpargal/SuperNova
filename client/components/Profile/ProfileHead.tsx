"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export const ProfileHead: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2 w-full justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/supra_logo.png"
          alt="SUPRA"
          height={25}
          width={25}
        />
        <h1 className="text-app-gunmetal text-xl tracking-wide">NOVA</h1>
      </div>

      <Link href="/bot-token">
        <Button>Back to App</Button>
      </Link>
    </div>
  );
};
