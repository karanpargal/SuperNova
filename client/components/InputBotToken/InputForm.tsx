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

const formSchema = z.object({
  botToken: z.string().min(2, {
    message: "Bot Token is required.",
  }),
  walletAddress: z.string().min(2, {
    message: "Wallet Address is required.",
  }),
});

export const InputForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botToken: "",
      walletAddress: "",
    },
  });

  // Define the onSubmit function
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
  };

  return (
    <section className="py-16">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 border border-app-pink rounded-lg text-left w-2/3 p-10"
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
                    className="w-full text-left border-app-jet border bg-app-eerie text-app-purple placeholder:text-app-gray/60 p-2"
                    placeholder=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="walletAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray text-lg">
                  Wallet Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-app-purple placeholder:text-app-gray/60 p-2"
                    placeholder="0x1234567890ABCDEF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="relative inline-flex items-center justify-center p-4 px-5 py-6 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 w-96 mx-auto mt-10">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-white">Submit</span>
          </Button>
        </form>
      </Form>
    </section>
  );
};