import { animated, useTransition } from "@react-spring/web"
import { PokemonArt, PokemonCatchReleaseAnimation, Tooltip } from "components"
import { POKEMON_CAUGHT_RELEASE_FLAG_TRANSITION_DURATION } from "lib"
import Link from "next/link"
import { forwardRef, useCallback, useRef, useState } from "react"
import { MdCatchingPokemon } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { PokemonCardProps } from "./pokemon-card.types"

export default forwardRef<HTMLDivElement, PokemonCardProps>(
  function PokemonCard(
    {
      identifier: id,
      resourceName,
      artSrc,
      name,
      onClick,
      animateArt = true,
      isOnPokedex = false,
      onCatchReleaseFinish,
      className,
      ...otherProps
    },
    ref
  ) {
    const [isCatchingOrReleasing, setIsCatchingOrReleasing] = useState(false)
    const cardRef = useRef<HTMLAnchorElement | null>(null)

    const handleCatchReleaseFinish = useCallback(() => {
      setIsCatchingOrReleasing(false)
      onCatchReleaseFinish?.()
    }, [onCatchReleaseFinish])

    const transition = useTransition(isOnPokedex, {
      config: {
        duration: POKEMON_CAUGHT_RELEASE_FLAG_TRANSITION_DURATION,
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
      <div
        {...otherProps}
        className={twMerge("flex flex-col items-center", className)}
        ref={ref}
      >
        <div className="[perspective:1000px] group/card">
          {!isCatchingOrReleasing && (
            <button
              onClick={() => setIsCatchingOrReleasing(true)}
              className="peer flex items-center space-x-1 absolute -top-3.5 -right-3.5 z-10 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all text-xs font-semibold bg-slate-200 hover:bg-red-500 hover:active:bg-red-600 text-slate-800 hover:text-white dark:bg-slate-500 dark:hover:bg-red-500/90 dark:active:bg-red-600/90 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 group/catch-button"
            >
              <MdCatchingPokemon size={22} />
              <span>{isOnPokedex ? "Release" : "Catch"}</span>
            </button>
          )}
          <Link
            className="relative flex px-4 py-10 shadow-md dark:shadow-black/50 rounded-lg bg-white dark:bg-slate-700 hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] peer-hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] hover:shadow-2xl peer-hover:shadow-2xl hover:dark:shadow-black/50 peer-hover:dark:shadow-black/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50"
            href={`/pokemon/${resourceName}`}
            ref={cardRef}
          >
            <PokemonCatchReleaseAnimation
              isCaught={isCatchingOrReleasing !== isOnPokedex}
              onAnimationFinished={handleCatchReleaseFinish}
            >
              <PokemonArt
                artSrc={artSrc}
                name={name}
                width={220}
                height={220}
                animate={animateArt}
              />
            </PokemonCatchReleaseAnimation>
          </Link>
        </div>
        <span className="text-slate-400 dark:text-slate-100 text-sm mt-2">
          #{id}
        </span>
        <div className="flex relative">
          <span className="text-slate-600 dark:text-slate-400 text-2xl font-light truncate">
            {name}
          </span>
          {transition(
            (styles, show) =>
              show && (
                <animated.div
                  className="absolute z-10 -left-7 h-full flex items-center"
                  style={{ ...styles }}
                >
                  <Tooltip content="In Pokédex">
                    <div
                      className="cursor-help rounded-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 before:absolute before:content-[''] before:-z-10 before:top-0.5 before:left-0.5 before:bg-white before:h-[calc(100%-4px)] before:w-[calc(100%-4px)] before:rounded-full"
                      tabIndex={0}
                    >
                      <MdCatchingPokemon
                        size={22}
                        className="text-red-500 dark:text-red-500/90"
                      />
                    </div>
                  </Tooltip>
                </animated.div>
              )
          )}
        </div>
      </div>
    )
  }
)
