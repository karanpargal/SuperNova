"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { useWalletContext } from "@/utils/context/WalletContext";
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
import { useState } from "react";
import { SuccessModal } from "../shared/successModal";

const formSchema = z.object({
  Name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  Symbol: z.string().min(2, {
    message: "Wallet Address is required.",
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Symbol: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
            ipfsHash: "QmP227jaBxfD7CVdx6KEvhVHGuzg2x2L2hK7BW5BLZdBVv",
            executeIpfsHash: "Qmd6U63pCjj6AzpFuxLSfxY7ov6v67MpnYYGyN1MFsjQZU",
            userId: localStorage.getItem("userId"),
            ciphertext:
              "r254q67XYFSAj6edqDqNWocssQ5qU3ALA5rPIkZ8xE2kxh3mh0ZajiQ3ftEBThNTi+Az3vv+Yz41neCObDMWzoYXm/otEbrl5MlshoWBUcVDtDPwWJQ2sbVHFHKDhGUn3bm/G3mA9s1gYMAaawrzy8g8tZvgCvEXshkIM/1n2f7DDo2bpEDLesrC9/hx3UrcrxYYGgI=",
            address: walletAddress,
            data_to_encrypt_hash:
              "9f94ebf7d1f06a603dda053b759e91d76d0c2b3e48cddb8bc921eafae6a17294",
            name: data.Name,
            symbol: data.Symbol,
          }),
        }
      );
      const responseData = await response.json();
      setTokenDetails({
        name: data.Name,
        symbol: data.Symbol,
        txnHash: responseData.transactionHash || "N/A",
      });
    } catch (error) {
      console.error("Minting Error:", error);
    } finally {
      setIsMinting(false);
      setIsSuccessModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsSuccessModalOpen(false);
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`md:space-y-8 space-y-3 border ${
            walletConnected ? "border-app-crimson" : "border-app-pink"
          }  rounded-lg text-left md:w-1/3 w-full md:p-10 p-6 mx-auto h-max mt-20`}
        >
          <FormField
            control={form.control}
            name="Name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={`${
                    walletConnected ? "text-app-secondary" : "text-app-gray"
                  } md:text-lg text-base`}
                >
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className={`w-full text-left ${
                      walletConnected
                        ? "bg-white text-app-gunmetal"
                        : "bg-app-eerie text-white"
                    }  border-app-jet border placeholder:text-app-gray/60 p-2`}
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-app-blue" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Symbol"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel
                  className={`${
                    walletConnected ? "text-app-secondary" : "text-app-gray"
                  } md:text-lg text-base`}
                >
                  Symbol
                </FormLabel>
                <FormControl>
                  <Input
                    className={`w-full text-left ${
                      walletConnected
                        ? "bg-white text-app-gunmetal"
                        : "bg-app-eerie text-white"
                    }  border-app-jet border placeholder:text-app-gray/60 p-2`}
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isMinting}
            type="submit"
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
              }rounded-full opacity-30 group-hover:rotate-90 ease`}
            ></span>
            <span className="relative text-white">
              {isMinting ? "Minting..." : "Mint"}
            </span>
          </Button>
        </form>
      </Form>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        setIsOpen={setIsSuccessModalOpen}
        tokenDetails={tokenDetails}
      />
    </section>
  );
};
