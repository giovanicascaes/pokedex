import { animated, useTransition } from "@react-spring/web"
import { PokemonArt, PokemonCatchReleaseAnimation } from "components"
import Link from "next/link"
import { forwardRef } from "react"
import { MdCatchingPokemon } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { POKEMON_CAUGHT_BADGE_TRANSITION_DURATION } from "../constants"
import PokemonCaughtBadge from "../pokemon-caught-badge"
import {
  PokemonListItemSimpleElement,
  PokemonListItemSimpleProps,
} from "./pokemon-list-item-simple.types"

export default forwardRef<
  PokemonListItemSimpleElement,
  PokemonListItemSimpleProps
>(function PokemonListItemSimple(
  {
    pokemonId,
    resourceName,
    name,
    artSrc,
    animateArt = true,
    isOnPokedex = false,
    onAnimationFinish,
    className,
    ...other
  },
  ref
) {
  const badgeTransition = useTransition(isOnPokedex, {
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
    initial: false,
  })

  return (
    <Link
      className={twMerge(
        className,
        "flex focus group/list-item shadow dark:shadow-md rounded-2xl bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-900 cursor-pointer transition-all w-full"
      )}
      href={`/pokemon/${resourceName}`}
      ref={ref}
    >
      <div className="flex space-x-4 m-2">
        <PokemonCatchReleaseAnimation
          isOnPokedex={isOnPokedex}
          onAnimationFinish={onAnimationFinish}
        >
          {({ isAnimating, runAnimation }) => (
            <>
              <PokemonCatchReleaseAnimation.Animate>
                <PokemonArt
                  artSrc={artSrc}
                  name={name}
                  width={80}
                  height={80}
                  animate={animateArt}
                />
              </PokemonCatchReleaseAnimation.Animate>
              <div className="flex flex-col my-auto">
                <span className="text-slate-400 group-hover/list-item:text-black dark:text-slate-100 dark:group-hover/list-item:text-white text-xs transition-colors">
                  #{pokemonId}
                </span>
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-600 group-hover/list-item:text-black dark:text-slate-400 dark:group-hover/list-item:text-white text-xl font-light truncate transition-colors">
                    {name}
                  </span>
                  {badgeTransition(
                    (style, show) =>
                      show && (
                        <animated.div
                          className="w-[22px] h-[22px]"
                          style={style}
                        >
                          <PokemonCaughtBadge isCaught={isOnPokedex} />
                        </animated.div>
                      )
                  )}
                </div>
              </div>
              {!isAnimating && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    runAnimation()
                  }}
                  className="z-10 flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 right-4 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/list-item:opacity-100 group-hover/list-item:visible transition-all text-xs font-semibold bg-slate-300 hover:bg-red-500/90 active:bg-red-600/90 text-black dark:bg-slate-700/60 dark:hover:bg-red-400 dark:hover:active:bg-red-500 dark:text-white hover:text-white focus group/catch-button"
                >
                  <MdCatchingPokemon size={22} />
                  <span>{isOnPokedex ? "Release" : "Catch"}</span>
                </button>
              )}
            </>
          )}
        </PokemonCatchReleaseAnimation>
      </div>
    </Link>
  )
})
