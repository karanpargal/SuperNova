"use client";

import Image from "next/image";
import { useWalletContext } from "@/utils/context/WalletContext";
import { minimizeAddress } from "@/utils/functions/helpers";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const BalanceDetails: React.FC = () => {
  const { walletAddress } = useWalletContext();
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async () => {
    try {
      const res = await fetch(
        `https://rpc-testnet.supra.com/rpc/v1/accounts/${walletAddress}/resources/0x1::coin::CoinStore%3C0x1::supra_coin::SupraCoin%3E`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setBalance(Number(data.result[0].coin.value) / Math.pow(10, 9));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!walletAddress) {
      window.location.href = "/";
    } else {
      fetchBalance();
    }
  }, [walletAddress]);
  return (
    <div className="flex items-center gap-2 p-4 mt-8 w-full justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/supra_logo.png"
          alt="SUPRA"
          height={25}
          width={25}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-app-gunmetal text-lg tracking-wide flex items-center gap-2">
            {balance} SUPRA
          </h1>
          <h1 className="text-app-gunmetal text-lg tracking-wide flex items-center gap-2">
            {minimizeAddress(walletAddress)}
            <CopyIcon
              className="h-4 w-4 text-black cursor-pointer"
              onClick={() => navigator.clipboard.writeText(walletAddress)}
            />
            <ExternalLinkIcon
              className="h-4 w-4 text-black cursor-pointer"
              onClick={() => {
                window.open(
                  `https://testnet.suprascan.io/account/${walletAddress}`,
                  "_blank"
                );
              }}
            />
          </h1>
        </div>
      </div>
    </div>
  );
};
