import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SelectProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "onChange"
  > {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  onChange: (value: any) => void;
  by?: string | ((a: any, b: any) => boolean);
}
