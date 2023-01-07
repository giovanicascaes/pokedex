import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref } from "react";

export interface SelectOptionsChildrenFnArgs {
  open: boolean;
}

export interface SelectOptionsProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    "ref" | "children"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLUListElement>;
  children: ReactNode | ((args: SelectOptionsChildrenFnArgs) => ReactNode);
}
