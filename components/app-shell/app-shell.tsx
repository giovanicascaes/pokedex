import { Inter } from "@next/font/google";
import { AppHeader, PageLoadingIndicator, TransitionLayout } from "components";
import { useThemeMode } from "contexts";
import { useAppScrollTop } from "hooks";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AppShellProps } from "./app-shell.types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AppShell({ children }: AppShellProps) {
  const [isSsrReady, setIsSsrReady] = useState(false);
  const [transitionDone, setTransitionDone] = useState(true);
  const { onScroll, ref: scrollRef } = useAppScrollTop(transitionDone);
  const [{ transitionClassNames }] = useThemeMode();

  useEffect(() => {
    setIsSsrReady(true);
  }, []);

  if (isSsrReady) {
    return (
      <main
        className="h-full overflow-auto relative"
        onScroll={onScroll}
        ref={scrollRef}
      >
        <div
          className={twMerge(
            inter.variable,
            "font-sans relative",
            transitionClassNames
          )}
        >
          <PageLoadingIndicator />
          <AppHeader className="sticky top-0 z-40" />
          <div className="bg-slate-50 dark:bg-slate-800 min-h-screen">
            <TransitionLayout
              onTransitionRest={() => setTransitionDone((current) => !current)}
            >
              {children}
            </TransitionLayout>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
