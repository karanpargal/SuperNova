import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { TokenProvider } from "@/utils/context/TokenContext";

const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

// const roboto = localFont({
//   src: [
//     {
//       path: "./fonts/Roboto-Regular.ttf",
//       weight: "400",
//       style: "normal",
//     },
//   ],
// });

export const metadata: Metadata = {
  title: "SupraNova",
  description: "Click on the embed to view the SupraNova project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${space_grotesk.variable} antialiased bg-app-night font-space-grotesk relative min-h-screen`}
      >
        <TokenProvider>
          <div className="hidden sm:block">
            <Navbar />
          </div>

          <div className="px-12">{children}</div>
        </TokenProvider>
      </body>
    </html>
  );
}
