import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface PageLoadingIndicatorProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "ref"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLDivElement>;
}

export type PageLoadingBarsProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
