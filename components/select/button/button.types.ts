import { DetailedHTMLProps, HTMLAttributes } from "react";

export type SelectButtonVariant = "default" | "unstyled";

export interface SelectButtonProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: SelectButtonVariant;
}
