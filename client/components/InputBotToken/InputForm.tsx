"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CopyIcon } from "lucide-react";
import Link from "next/link";
import { useWalletContext } from "@/utils/context/WalletContext";

const formSchema = z.object({
  botToken: z.string().min(2, {
    message: "Bot Token is required.",
  }),
});

export const InputForm: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { walletConnected, setWalletAddress, walletAddress } =
    useWalletContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botToken: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
    setSubmitted(true);
  };

  const handleMintPkp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-account`,
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
          }),
        }
      );
      const data = await response.json();
      setWalletAddress(data.address);
      localStorage.setItem("address", data.address);
      localStorage.setItem("ciphertext", data.ciphertext);
      localStorage.setItem("data_to_encrypt_hash", data.data_to_encrypt_hash);
      await fetch(
        `https://rpc-testnet.supra.com/rpc/v1/wallet/faucet/${walletAddress}`
      );
    } catch (error) {
      console.error("Mint PKP Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimToken = async () => {
    if (!walletAddress) {
      console.error("Wallet address is missing. Please connect your wallet.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/claim-token`,
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
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Minting Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("address")) {
      setWalletAddress(localStorage.getItem("address")!);
    }
  }, []);

  return (
    <section className="md:py-16 py-8 flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`md:space-y-8 space-y-2 border ${
            walletConnected ? "border-app-crimson" : "border-app-pink"
          } rounded-lg text-left md:w-2/3 w-full md:p-10 p-6 mx-auto`}
        >
          <FormField
            control={form.control}
            name="botToken"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={`${
                    walletConnected ? "text-app-secondary" : "text-app-gray"
                  } text-lg`}
                >
                  Bot Token
                </FormLabel>
                <FormControl>
                  <Input
                    className={` w-full text-left ${
                      walletConnected
                        ? "bg-white text-app-gunmetal"
                        : "bg-app-eerie text-white"
                    }  border-app-jet border placeholder:text-app-gray/60 p-2`}
                    placeholder="your bot token"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-app-blue" />
              </FormItem>
            )}
          />

          {walletAddress && (
            <FormItem className="flex flex-col mt-4">
              <FormLabel className="text-app-gray text-lg">
                Wallet Address
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 p-2"
                    value={walletAddress}
                    disabled
                  />
                  <CopyIcon
                    className="h-4 w-4 text-black"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      alert("Copied to clipboard");
                    }}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}

          <div className="flex flex-wrap md:flex-row flex-col md:gap-2">
            {!walletAddress && (
              <Button
                type="button"
                className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
                  walletConnected
                    ? "hover:ring-app-crimson"
                    : "hover:ring-purple-500"
                } md:w-96 w-64 mx-auto md:mt-10 mt-6`}
                onClick={() => {
                  handleMintPkp();
                }}
                disabled={loading}
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
                  }rounded-full opacity-30 group-hover:rotate-90 ease`}
                ></span>
                <span className="relative text-white">
                  {loading ? "Generating Wallet..." : "Generate Wallet"}
                </span>
              </Button>
            )}
            {submitted ? (
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
                    walletConnected ? "bg-pink-950" : "bg-pink-500 "
                  }rounded-full opacity-30 group-hover:rotate-90 ease`}
                ></span>
                <span className="relative text-white">Submit</span>
              </Button>
            ) : (
              <div className="flex justify-between mx-auto items-center gap-x-10">
                <Link href="/create-token">
                  <Button
                    className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
                      walletAddress
                        ? "hover:ring-pink-950"
                        : "hover:ring-purple-500"
                    } md:w-96 w-32 mx-auto md:mt-10 mt-6`}
                    disabled={loading}
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
                      }rounded-full opacity-30 group-hover:rotate-90 ease`}
                    ></span>
                    <span className="relative text-white">Mint Token</span>
                  </Button>
                </Link>
                <Button
                  className={`relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 ${
                    walletConnected
                      ? "hover:ring-pink-950"
                      : "hover:ring-purple-500"
                  } md:w-96 w-32 mx-auto md:mt-10 mt-6`}
                  onClick={() => {
                    handleClaimToken();
                  }}
                  disabled={loading}
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
                    }rounded-full opacity-30 group-hover:rotate-90 ease`}
                  ></span>
                  <span className="relative text-white">Claim Token</span>
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>
    </section>
  );
};
