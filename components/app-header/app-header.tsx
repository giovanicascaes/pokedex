import { animated, useTransition } from "@react-spring/web"
import PokemonLogo from "assets/img/pokemon-logo.png"
import { AppBreadcrumb, Badge, ThemeSwitcher } from "components"
import { usePokemon } from "contexts"
import {
  POKEDEX_LINK_ELEMENT_ID,
  POKEMON_CAUGHT_BADGE_TRANSITION_DURATION,
} from "lib"
import Image from "next/image"
import Link from "next/link"
import { forwardRef } from "react"
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2"
import { twJoin, twMerge } from "tailwind-merge"
import { AppHeaderProps } from "./app-header.types"

const actionButtonClassName =
  "w-8 h-8 flex items-center justify-center rounded-full app-header-text"

function HeaderActionButtons() {
  const [{ pokedex }] = usePokemon()

  const transition = useTransition(pokedex.length, {
    config: {
      duration: POKEMON_CAUGHT_BADGE_TRANSITION_DURATION,
    },
    from: {
      scale: 0,
    },
    enter: [
      {
        scale: 1.3,
      },
      {
        scale: 1,
      },
    ],
    leave: {
      scale: 0,
    },
    exitBeforeEnter: true,
  })

  return (
    <div className="flex space-x-4 items-center">
      <Link
        id={POKEDEX_LINK_ELEMENT_ID}
        href="/pokedex"
        className={twJoin(actionButtonClassName, "relative focus-default")}
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
      <ThemeSwitcher
        buttonClassName={twJoin(actionButtonClassName, "focus-default")}
      />
    </div>
  )
}

export default forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  { className, ...other },
  ref
) {
  return (
    <header
      {...other}
      className={twMerge(
        "relative w-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-b border-slate-600/10 dark:border-slate-300/10 px-6 h-[70px] flex items-center justify-between",
        className
      )}
      ref={ref}
    >
      <div className="flex items-center">
        <Link href="/" className="focus-default rounded">
          <Image src={PokemonLogo} alt="Pokémon logo" height={40} priority />
        </Link>
        <AppBreadcrumb className="ml-4" />
      </div>
      <HeaderActionButtons />
    </header>
  )
})
