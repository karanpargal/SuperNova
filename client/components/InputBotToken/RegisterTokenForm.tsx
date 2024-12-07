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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  walletAddress: z.string().min(2, {
    message: "Wallet Address is required.",
  }),
  email: z.string().email().optional(),
  telegram: z.string().min(2, {
    message: "Telegram is required.",
  }),
});

export const RegisterTokenForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      walletAddress: "",
      email: "",
      telegram: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
  };

  return (
    <section className="md:py-16 py-8 flex bg-app-night px-12 h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:space-y-8 space-y-3 border border-app-pink rounded-lg text-left md:w-1/3 w-full md:p-10 p-6 mx-auto h-max"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray md:text-lg text-base">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 md:p-2 text-sm"
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
            name="walletAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray md:text-lg text-base">
                  Wallet Address
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 md:p-2 text-sm"
                    placeholder="0x1234567890ABCDEF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray md:text-lg text-base">
                  Email ID (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 md:p-2 text-sm"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-app-gray md:text-lg text-base">
                  Telegram
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-left border-app-jet border bg-app-eerie text-white placeholder:text-app-gray/60 p-2"
                    placeholder="@username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="relative inline-flex items-center justify-center md:p-4 p-2 md:px-5 px-2 md:py-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500 w-full mx-auto mt-10">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
            <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
            <span className="relative text-white">Submit</span>
          </Button>
        </form>
      </Form>
    </section>
  );
};
