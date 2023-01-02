import Image from "next/image";
import Link from "next/link";
import { Children, forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  AppHeaderBreadcrumbItemLinkProps,
  AppHeaderBreadcrumbItemProps,
  AppHeaderBreadcrumbProps,
  AppHeaderProps,
} from "./app-header.types";
import PokemonLogo from "assets/img/pokemon-logo.png";
import { useRouter } from "next/router";

function BreadcrumbItemLink({
  href,
  className,
  ...props
}: AppHeaderBreadcrumbItemLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      className={twMerge("cursor-pointer", className)}
    />
  );
}

function BreadcrumbItem({ className, ...other }: AppHeaderBreadcrumbItemProps) {
  return (
    <span
      {...other}
      className={twMerge(
        "font-medium text-sm text-slate-500 rounded-full hover:bg-slate-400/10 hover:text-black px-2.5 py-1",
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
        <>
          {child}
          {i !== Children.count(children) - 1 && (
            <span className="text-slate-300 font-semibold">/</span>
          )}
        </>
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
          <BreadcrumbItem>{asPath.split("/").slice(-1)[0]}</BreadcrumbItem>
        </Breadcrumb>
      )}
    </header>
  );
});
