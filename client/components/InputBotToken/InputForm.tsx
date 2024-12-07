"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

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

const formSchema = z.object({
  botToken: z.string().min(2, {
    message: "Bot Token is required.",
  }),
});

export const InputForm: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botToken: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
  };

  const handleMintPkp = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: localStorage.getItem("token"),
          ipfsHash: "QmP227jaBxfD7CVdx6KEvhVHGuzg2x2L2hK7BW5BLZdBVv",
          userId: localStorage.getItem("userId"),
        }),
      });
      const data = await response.json();
      setWalletAddress(data.pkpEthAddress);
      localStorage.setItem("pkpEthAddress", data.pkpEthAddress);
    } catch (error) {
      console.error("Mint PKP Error:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("pkpEthAddress")) {
      setWalletAddress(localStorage.getItem("pkpEthAddress")!);
    }
  }, []);

  return (
    <section className="md:py-16 py-8 flex">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:space-y-8 space-y-2 border border-app-pink rounded-lg text-left md:w-2/3 w-full md:p-10 p-6 mx-auto"
        >
          <FormField
            control={form.control}
            name="botToken"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray text-lg">
                  Bot Token
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 p-2"
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
                <Input
                  className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 p-2"
                  value={walletAddress}
                  disabled
                />
              </FormControl>
            </FormItem>
          )}

          <div className="flex flex-wrap md:flex-row flex-col md:gap-2">
            {!walletAddress && (
              <Button
                className="relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 md:w-96 w-64 mx-auto md:mt-10 mt-6"
                onClick={() => {
                  handleMintPkp();
                }}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                <span className="relative text-white">Get Wallet</span>
              </Button>
            )}
            <Button className="relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 md:w-96 w-64 mx-auto md:mt-10 mt-6">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-white">Submit</span>
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
