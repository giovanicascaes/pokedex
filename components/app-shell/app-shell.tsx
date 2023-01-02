import { Inter } from "@next/font/google";
import { AppHeader } from "components";
import { useCallback, useState } from "react";
import { twJoin } from "tailwind-merge";
import { AppShellProps } from "./app-shell.types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AppShell({ children }: AppShellProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRefCallback = useCallback((node: HTMLElement) => {
    if (node) {
      setHeaderHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <main
      className={twJoin(
        inter.variable,
        "font-sans bg-slate-50 overflow-visible flex flex-col"
      )}
      style={{ paddingTop: headerHeight }}
    >
      <AppHeader className="fixed top-0 left-0 z-40" ref={headerRefCallback} />
      {children}
    </main>
  );
}
