import { animated, useTransition } from "@react-spring/web"
import { Tooltip } from "components/tooltip"
import { POKEMON_CAUGHT_BADGE_TRANSITION_DURATION } from "lib"
import { MdCatchingPokemon } from "react-icons/md"
import { PokemonCaughtBadgeProps } from "./pokemon-list-item.types"

export default function PokemonCaughtBadge({
  isCaught,
  style,
  ...other
}: PokemonCaughtBadgeProps) {
  const transition = useTransition(isCaught, {
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
    <>
      {transition(
        (transitionStyles, show) =>
          show && (
            <animated.div
              {...other}
              style={{ ...style, ...transitionStyles }}
              onClick={(e) => e.preventDefault()}
            >
              <Tooltip content="In Pokédex">
                <div
                  className="cursor-help rounded-full relative bg-white w-[18px] h-[18px] focus-default"
                  tabIndex={0}
                >
                  <MdCatchingPokemon
                    size={22}
                    className="-top-[2px] -left-[2px] text-red-500 dark:text-red-500/90 absolute"
                  />
                </div>
              </Tooltip>
            </animated.div>
          )
      )}
    </>
  )
}
