import { PokemonEvolutionChainLinkCard } from "components"
import { forwardRef } from "react"
import { MdChevronRight } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import {
  PokemonEvolutionChainArrowProps,
  PokemonEvolutionChainLinkProps,
  PokemonEvolutionChainNodeContainerProps,
  PokemonEvolutionChainPathProps,
  PokemonEvolutionChainProps,
} from "./pokemon-evolution-chain.types"
import useDirection from "./use-direction"

function isSecondToLast({ evolvesTo }: PokemonEvolutionChainPathProps) {
  return evolvesTo.every((evolution) => !evolution.evolvesTo.length)
}

function Arrow({
  vertical = false,
  className,
  ...other
}: PokemonEvolutionChainArrowProps) {
  return (
    <MdChevronRight
      {...other}
      size={52}
      className={twMerge(
        "text-slate-400/70 dark:text-slate-400",
        vertical ? "rotate-90" : "mb-5",
        className
      )}
    />
  )
}

const EvolutionNodeContainer = forwardRef<
  HTMLDivElement,
  PokemonEvolutionChainNodeContainerProps
>(function EvolutionNodeContainer(
  { vertical = false, enableWrap = false, children, className, ...other },
  ref
) {
  return (
    <div
      {...other}
      className={twMerge(
        "justify-center items-center",
        vertical ? "flex flex-col space-y-8" : "inline-flex gap-8",
        enableWrap && "flex-wrap",
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  )
})

function EvolutionChainPath(pokemon: PokemonEvolutionChainPathProps) {
  const { evolvesTo, isBaby, species, vertical = false, ...other } = pokemon

  return (
    <EvolutionNodeContainer {...other} vertical={vertical}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <EvolutionNodeContainer vertical={vertical}>
          <Arrow vertical={vertical} />
          <EvolutionNodeContainer
            vertical={!vertical}
            enableWrap={isSecondToLast(pokemon)}
          >
            {evolvesTo.map((evolution) => (
              <EvolutionChainLink
                key={evolution.species.id}
                {...evolution}
                vertical={vertical}
              />
            ))}
          </EvolutionNodeContainer>
        </EvolutionNodeContainer>
      )}
    </EvolutionNodeContainer>
  )
}

const EvolutionChainLink = forwardRef<
  HTMLDivElement,
  PokemonEvolutionChainLinkProps
>(function EvolutionChainLink(pokemon, ref) {
  const { evolvesTo, isBaby, species, vertical, ...other } = pokemon

  return (
    <EvolutionNodeContainer {...other} vertical={vertical} ref={ref}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <>
          <Arrow vertical={vertical} />
          <EvolutionNodeContainer
            vertical={!vertical}
            enableWrap={isSecondToLast(pokemon)}
            className="items-start"
          >
            {evolvesTo.map((evolution) => (
              <EvolutionChainPath
                key={evolution.species.id}
                {...evolution}
                vertical={vertical}
              />
            ))}
          </EvolutionNodeContainer>
        </>
      )}
    </EvolutionNodeContainer>
  )
})

export default function PokemonEvolutionChain({
  evolutionChain,
  children,
  className,
  ...other
}: PokemonEvolutionChainProps) {
  const [{ chainRef, containerRef }, direction] = useDirection(evolutionChain)

  return (
    <div
      {...other}
      className={twMerge(
        "flex flex-col bg-slate-200/40 dark:bg-slate-600/30 rounded-xl",
        className
      )}
    >
      {evolutionChain.evolvesTo.length === 0 && (
        <span className="text-slate-400 dark:text-slate-500 text-sm mt-4 text-center">
          This pokemon does not evolve
        </span>
      )}
      <div className="p-10 flex justify-center" ref={containerRef}>
        <EvolutionChainLink
          {...evolutionChain}
          vertical={direction === "vertical"}
          ref={chainRef}
        />
      </div>
    </div>
  )
}
