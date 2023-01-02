import { DetailedHTMLProps, HTMLAttributes } from "react";

export type AppShellProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
  "className"
>;
