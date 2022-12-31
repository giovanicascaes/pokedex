import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface SelectOptionsProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    "ref"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLUListElement>;
}
