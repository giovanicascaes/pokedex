import { Inter } from "@next/font/google";
import type { AppProps } from "next/app";
import { twJoin } from "tailwind-merge";
import "../styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={twJoin(inter.variable, "font-sans px-14 py-4 bg-slate-50/50")}
    >
      <Component {...pageProps} />
    </main>
  );
}
