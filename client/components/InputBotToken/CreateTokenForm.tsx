"use client";

import { z } from "zod";
import { useState } from "react";
import { useWalletContext } from "@/utils/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessModal } from "../shared/successModal";

const formSchema = z.object({
  Name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  Symbol: z.string().min(2, {
    message: "Symbol must be at least 2 characters.",
  }),
});

export const CreateTokenForm: React.FC = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { walletAddress, walletConnected } = useWalletContext();
  const [tokenDetails, setTokenDetails] = useState({
    name: "",
    symbol: "",
    txnHash: "",
  });

  const [formData, setFormData] = useState({
    Name: "",
    Symbol: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error for the field being edited
    }));
  };

  const handleValidation = () => {
    const validationErrors: { [key: string]: string } = {};
    if (formData.Name.length < 2) {
      validationErrors.Name = "Name must be at least 2 characters.";
    }
    if (formData.Symbol.length < 2) {
      validationErrors.Symbol = "Symbol must be at least 2 characters.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!handleValidation()) return;

    if (!walletAddress) {
      console.error("Wallet address is missing. Please connect your wallet.");
      return;
    }

    setIsMinting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mint-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: localStorage.getItem("token"),
            ipfsHash: process.env.NEXT_PUBLIC_IPFS_HASH,
            executeIpfsHash: process.env.NEXT_PUBLIC_EXECUTE_IPFS_HASH,
            userId: localStorage.getItem("userId"),
            ciphertext: localStorage.getItem("ciphertext"),
            address: walletAddress,
            data_to_encrypt_hash: localStorage.getItem("data_to_encrypt_hash"),
            name: formData.Name,
            symbol: formData.Symbol,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mint token: ${response.statusText}`);
      }

      const responseData = await response.json();

      setTokenDetails({
        name: formData.Name,
        symbol: formData.Symbol,
        txnHash: responseData.transactionHash || "N/A",
      });

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Minting Error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <section
      className={`md:py-2 py-8 flex flex-col ${
        walletConnected ? "bg-white" : "bg-app-night"
      } px-12 h-screen`}
    >
      <h1
        className={`text-2xl font-medium ${
          walletConnected ? "text-app-gunmetal" : "text-app-gray"
        }`}
      >
        MINT TOKEN
      </h1>

      <div
        className={`md:space-y-8 space-y-3 border ${
          walletConnected ? "border-app-crimson" : "border-app-pink"
        } rounded-lg text-left md:w-1/3 w-full md:p-10 p-6 mx-auto h-max mt-20`}
      >
        <div className="flex flex-col gap-y-2">
          <label
            className={`${
              walletConnected ? "text-app-secondary" : "text-app-gray"
            } md:text-lg text-base`}
          >
            Name of the Token
          </label>
          <input
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className={`w-full text-left rounded-lg ${
              walletConnected
                ? "bg-white text-app-gunmetal"
                : "bg-app-eerie text-white"
            }  border-app-jet border placeholder:text-app-gray/60 p-2`}
            placeholder="Chill Guy"
          />
          {errors.Name && <div className="text-red-500">{errors.Name}</div>}
        </div>

        <div className="flex flex-col gap-y-2">
          <label
            className={`${
              walletConnected ? "text-app-secondary" : "text-app-gray"
            } md:text-lg text-base`}
          >
            Symbol
          </label>
          <input
            name="Symbol"
            value={formData.Symbol}
            onChange={handleInputChange}
            className={`w-full text-left rounded-lg ${
              walletConnected
                ? "bg-white text-app-gunmetal"
                : "bg-app-eerie text-white"
            }  border-app-jet border placeholder:text-app-gray/60 p-2`}
            placeholder="CHILL"
          />
          {errors.Symbol && <div className="text-red-500">{errors.Symbol}</div>}
        </div>

        <Button
          disabled={isMinting}
          onClick={handleFormSubmit}
          className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
            walletConnected ? "hover:ring-pink-950" : "hover:ring-purple-500"
          } w-full mx-auto md:mt-10 mt-6`}
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
              walletConnected ? "bg-pink-950" : "bg-pink-500 "
            } rounded-full opacity-30 group-hover:rotate-90 ease`}
          ></span>
          <span className="relative text-white">
            {isMinting ? "Minting..." : "Mint"}
          </span>
        </Button>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        tokenDetails={tokenDetails}
      />
    </section>
  );
};
