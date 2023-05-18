import { PokemonArt, PokemonCatchReleaseAnimation } from "components"
import Link from "next/link"
import { forwardRef } from "react"
import { MdCatchingPokemon } from "react-icons/md"
import { twMerge } from "tailwind-merge"
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
  return (
    <Link
      {...other}
      className={twMerge(
        "group/list-item shadow dark:shadow-md relative rounded-2xl flex p-2 space-x-4 bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-900 cursor-pointer transition-all focus-default",
        className
      )}
      href={`/pokemon/${resourceName}`}
      ref={ref}
    >
      <PokemonCatchReleaseAnimation
        isOnPokedex={isOnPokedex}
        onAnimationFinish={onAnimationFinish}
      >
        {({ isAnimating, runAnimation }) => (
          <>
            <PokemonCatchReleaseAnimation.Wrapper>
              <PokemonArt
                artSrc={artSrc}
                name={name}
                width={80}
                height={80}
                animate={animateArt}
              />
            </PokemonCatchReleaseAnimation.Wrapper>
            <div className="flex flex-col my-auto">
              <span className="text-slate-400 group-hover/list-item:text-black dark:text-slate-100 dark:group-hover/list-item:text-white text-xs transition-colors">
                #{pokemonId}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 group-hover/list-item:text-black dark:text-slate-400 dark:group-hover/list-item:text-white text-xl font-light truncate transition-colors">
                  {name}
                </span>
                <PokemonCaughtBadge isCaught={isOnPokedex} />
              </div>
            </div>
            {!isAnimating && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  runAnimation()
                }}
                className="z-10 flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 right-4 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/list-item:opacity-100 group-hover/list-item:visible transition-all text-xs font-semibold bg-slate-300 hover:bg-red-500/90 active:bg-red-600/90 text-black dark:bg-slate-700/60 dark:hover:bg-red-400 dark:hover:active:bg-red-500 dark:text-white hover:text-white focus-default group/catch-button"
              >
                <MdCatchingPokemon size={22} />
                <span>{isOnPokedex ? "Release" : "Catch"}</span>
              </button>
            )}
          </>
        )}
      </PokemonCatchReleaseAnimation>
    </Link>
  )
})
