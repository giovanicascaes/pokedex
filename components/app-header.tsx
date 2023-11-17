import { animated, useTransition } from "@react-spring/web"
import PokemonLogo from "assets/img/pokemon-logo.png"
import { AppBreadcrumb, Badge, ThemeSwitcher } from "components"
import { usePokemon } from "contexts"
import { POKEDEX_LINK_ELEMENT_ID } from "lib"
import Image from "next/image"
import Link from "next/link"
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2"
import { twJoin } from "tailwind-merge"

const POKEDEX_COUNT_BADGE_TRANSITION_DURATION = 130

const actionClassName =
  "w-8 h-8 flex items-center justify-center rounded-full app-header-text"

function Actions() {
  const [{ pokedex }] = usePokemon()

  const transition = useTransition(pokedex.length, {
    config: {
      duration: POKEDEX_COUNT_BADGE_TRANSITION_DURATION,
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
        className={twJoin(actionClassName, "relative focus")}
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
                  className="min-w-[1.25rem] min-h-[1.25rem] backdrop-blur-lg"
                >
                  {count}
                </Badge>
              </animated.div>
            )
        )}
        <HiOutlineDevicePhoneMobile size={20} />
      </Link>
      <ThemeSwitcher buttonClassName={twJoin(actionClassName, "focus")} />
    </div>
  )
}

export default function AppHeader() {
  return (
    <header className="sticky top-0 p-2 z-50">
      <div className=" flex-shrink-0 h-[70px] bg-white/70 dark:bg-slate-700/70 rounded-2xl backdrop-blur-lg shadow-[0_0_8px_0_rgba(0,0,0,0.06)] px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="focus rounded">
            <Image src={PokemonLogo} alt="Pokémon logo" height={40} priority />
          </Link>
          <AppBreadcrumb className="ml-4" />
        </div>
        <Actions />
      </div>
    </header>
  )
}
