import PokemonLogo from "assets/img/pokemon-logo.png";
import { ThemeSwitcher } from "components";
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
        "cursor-pointer focus-visible:outline-none focus-visible:border-b-2 focus-visible:border-red-500 focus-visible:border-opacity-50 dark:focus-visible:border-red-400",
        className
      )}
    />
  );
}

function BreadcrumbItem({
  disabled,
  className,
  ...other
}: AppHeaderBreadcrumbItemProps) {
  return (
    <span
      {...other}
      className={twMerge(
        "font-medium text-sm text-slate-500 dark:text-slate-300 rounded-full px-2.5 py-1 transition-colors",
        !disabled && "hover:text-black dark:hover:text-white",
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
            <span className="text-slate-300 dark:text-slate-500 font-semibold">
              /
            </span>
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
        "relative w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-b border-slate-900/10 dark:border-slate-300/10 px-6 h-[70px] flex items-center justify-between",
        className
      )}
      ref={ref}
    >
      <div className="flex items-center">
        <div>
          <Image src={PokemonLogo} alt="Pokémon logo" height={40} />
        </div>
        {pathname !== "/" && (
          <Breadcrumb className="ml-4">
            <BreadcrumbItem>
              <BreadcrumbItemLink href="/">pokemon</BreadcrumbItemLink>
            </BreadcrumbItem>
            <BreadcrumbItem
              disabled
              className="font-semibold text-red-500 dark:text-red-400"
            >
              {asPath.split("/").slice(-1)[0]}
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </div>
      <ThemeSwitcher />
    </header>
  );
});
