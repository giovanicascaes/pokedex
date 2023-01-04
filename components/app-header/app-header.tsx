import PokemonLogo from "assets/img/pokemon-logo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Children, forwardRef, Fragment } from "react";
import { twMerge } from "tailwind-merge";
import {
  AppHeaderBreadcrumbItemLinkProps,
  AppHeaderBreadcrumbItemProps,
  AppHeaderBreadcrumbProps,
  AppHeaderProps,
} from "./app-header.types";

function BreadcrumbItemLink({
  href,
  className,
  ...props
}: AppHeaderBreadcrumbItemLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={twMerge(
        "cursor-pointer focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-red-500 focus-visible:border-opacity-50",
        className
      )}
    />
  );
}

function BreadcrumbItem({ className, ...other }: AppHeaderBreadcrumbItemProps) {
  return (
    <span
      {...other}
      className={twMerge(
        "font-medium text-sm text-slate-500 rounded-full hover:bg-slate-400/10 active:bg-slate-400/20 hover:text-black px-2.5 py-1 transition-colors",
        className
      )}
    />
  );
}

function Breadcrumb({
  children,
  className,
  ...other
}: AppHeaderBreadcrumbProps) {
  return (
    <div {...other} className={twMerge("space-x-1", className)}>
      {Children.map(children, (child, i) => (
        <Fragment key={i}>
          {child}
          {i !== Children.count(children) - 1 && (
            <span className="text-slate-300 font-semibold">/</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  { className, ...other },
  ref
) {
  const { pathname, asPath } = useRouter();

  return (
    <header
      {...other}
      className={twMerge(
        "w-full bg-white/70 backdrop-blur-lg border-b border-slate-900/10 px-6 h-[70px] flex items-center",
        className
      )}
      ref={ref}
    >
      <div>
        <Image src={PokemonLogo} alt="Pokémon logo" height={40} />
      </div>
      {pathname !== "/" && (
        <Breadcrumb className="ml-4">
          <BreadcrumbItem>
            <BreadcrumbItemLink href="/">pokemon</BreadcrumbItemLink>
          </BreadcrumbItem>
          <BreadcrumbItem className="pointer-events-none">
            {asPath.split("/").slice(-1)[0]}
          </BreadcrumbItem>
        </Breadcrumb>
      )}
    </header>
  );
});
