import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { TokenProvider } from "@/utils/context/TokenContext";
import { WalletProvider } from "@/utils/context/WalletContext";

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
        className={`${space_grotesk.variable} antialiased font-space-grotesk relative min-h-screen`}
      >
        <TokenProvider>
          <WalletProvider>
            <div className="hidden sm:block">
              <Navbar />
            </div>

            <div className="">{children}</div>
          </WalletProvider>
        </TokenProvider>
      </body>
    </html>
  );
}
