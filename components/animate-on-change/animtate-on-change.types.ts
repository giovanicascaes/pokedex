import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface AnimateOnChangeProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "ref"
  > {
  ref?: Ref<HTMLDivElement>;
  animationKey: any;
  transitionDuration?: number;
}
