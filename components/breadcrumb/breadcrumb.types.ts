import { LinkProps } from "next/link";
import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export type BreadcrumbProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export interface BreadcrumbItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  disabled?: boolean;
}

export interface BreadcrumbLinkProps
  extends LinkProps,
    Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      "onClick" | "onMouseEnter" | "onTouchStart" | "ref"
    > {
  // `Next`'s `Link` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLAnchorElement>;
}
