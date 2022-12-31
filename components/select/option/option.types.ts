import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectOptionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  value: any;
  disabled?: boolean;
}
