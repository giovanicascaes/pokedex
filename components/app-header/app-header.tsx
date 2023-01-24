import { animated, easings, useTransition } from "@react-spring/web";
import PokemonLogo from "assets/img/pokemon-logo.png";
import { Badge, Breadcrumb, ThemeSwitcher } from "components";
import { usePokemonView } from "contexts";
import { POKEDEX_LINK_ELEMENT_ID } from "lib";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { twJoin, twMerge } from "tailwind-merge";
import { AppHeaderProps } from "./app-header.types";

const BREADCRUMB_TRANSITION_DURATION = 150;

const POKEDEX_BADGE_TRANSITION = 200;

const actionButtonClassName =
  "w-8 h-8 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white";

function ActionButtons() {
  const [{ pokedex }] = usePokemonView();

  const transition = useTransition(pokedex.length, {
    config: {
      duration: POKEDEX_BADGE_TRANSITION,
      easing: easings.easeInOutBack,
    },
    from: { scale: 0 },
    enter: { scale: 1 },
    leave: { scale: 0 },
    exitBeforeEnter: true,
  });

  return (
    <div className="flex space-x-4 items-center">
      <Link
        id={POKEDEX_LINK_ELEMENT_ID}
        href="/pokedex"
        className={twJoin(actionButtonClassName, "relative")}
      >
        {transition(
          (styles, count) =>
            count > 0 && (
              <animated.div
                className="absolute -top-1 -right-1 origin-center"
                style={{ ...styles }}
              >
                <Badge
                  variant="rounded"
                  className="min-w-[1.25rem] min-h-[1.25rem]"
                >
                  {count}
                </Badge>
              </animated.div>
            )
        )}
        <HiOutlineDevicePhoneMobile size={20} />
      </Link>
      <ThemeSwitcher buttonClassName={actionButtonClassName} />
    </div>
  );
}

export default forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  { className, ...other },
  ref
) {
  const { pathname } = useRouter();
  const [{ viewingPokemon }] = usePokemonView();

  const shouldShowBreadCrumb =
    pathname !== "/" && (pathname !== "/pokemon/[key]" || !!viewingPokemon);

  const transition = useTransition(shouldShowBreadCrumb, {
    config: {
      easing: easings.linear,
      duration: BREADCRUMB_TRANSITION_DURATION,
    },
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    exitBeforeEnter: true,
  });

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
        {transition(
          (styles, show) =>
            show && (
              <animated.div style={{ ...styles }}>
                <Breadcrumb className="ml-4">
                  <Breadcrumb.Item>
                    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item
                    disabled
                    className="font-semibold text-red-500 dark:text-red-400"
                  >
                    {viewingPokemon?.name ?? "Pokédex"}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </animated.div>
            )
        )}
      </div>
      <ActionButtons />
    </header>
  );
});
