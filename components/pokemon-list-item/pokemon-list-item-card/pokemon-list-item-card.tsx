import { PokemonArt, PokemonCatchReleaseAnimation } from "components"
import Link from "next/link"
import { forwardRef } from "react"
import { MdCatchingPokemon } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import PokemonCaughtBadge from "../pokemon-caught-badge"
import {
  PokemonListItemCardElement,
  PokemonListItemCardProps,
} from "./pokemon-list-item-card.types"

export default forwardRef<PokemonListItemCardElement, PokemonListItemCardProps>(
  function PokemonListItemCard(
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
      <PokemonCatchReleaseAnimation
        isOnPokedex={isOnPokedex}
        onAnimationFinish={onAnimationFinish}
      >
        {({ isAnimating, runAnimation }) => (
          <div
            {...other}
            className={twMerge("flex flex-col items-center w-min", className)}
            ref={ref}
          >
            <div className="[perspective:900px] group/card">
              {!isAnimating && (
                <button
                  onClick={runAnimation}
                  className="peer flex items-center space-x-1 absolute -top-3.5 -right-3.5 z-10 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all text-xs font-semibold bg-slate-200 hover:bg-red-500 hover:active:bg-red-600 text-slate-800 hover:text-white dark:bg-slate-500 dark:hover:bg-red-500/90 dark:active:bg-red-600/90 dark:text-white focus-default group/catch-button"
                >
                  <MdCatchingPokemon size={22} />
                  <span>{isOnPokedex ? "Release" : "Catch"}</span>
                </button>
              )}
              <Link
                className="relative flex px-4 py-10 shadow-md dark:shadow-black/50 rounded-lg bg-white dark:bg-slate-700 hover:rotate-yz-scale peer-hover:rotate-yz-scale hover:shadow-2xl peer-hover:shadow-2xl hover:dark:shadow-black/50 peer-hover:dark:shadow-black/50 transition-all focus-default"
                href={`/pokemon/${resourceName}`}
                scroll={false}
              >
                <PokemonCatchReleaseAnimation.Animate>
                  <PokemonArt
                    artSrc={artSrc}
                    name={name}
                    width={220}
                    height={220}
                    animate={animateArt}
                  />
                </PokemonCatchReleaseAnimation.Animate>
              </Link>
            </div>
            <span className="text-slate-400 dark:text-slate-100 text-sm mt-2">
              #{pokemonId}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-slate-600 dark:text-slate-400 text-2xl font-light truncate">
                {name}
              </span>
              <PokemonCaughtBadge isCaught={isOnPokedex} />
            </div>
          </div>
        )}
      </PokemonCatchReleaseAnimation>
    )
  }
)
