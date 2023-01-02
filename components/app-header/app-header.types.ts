import { LinkProps } from "next/link";
import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export type AppHeaderProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export type AppHeaderBreadcrumbProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type AppHeaderBreadcrumbItemProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

export interface AppHeaderBreadcrumbItemLinkProps
  extends Omit<
      DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
      "ref"
    >,
    Pick<LinkProps, "href"> {
  // `Next`'s `Link` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLAnchorElement>;
}
