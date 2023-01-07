import { PokemonEvolutionChainLinkCard } from "components";
import { EvolutionChainLink } from "lib";
import { MdKeyboardArrowRight } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import {
  PokemonEvolutionChainArrowProps,
  PokemonEvolutionChainLinkProps,
  PokemonEvolutionChainNodeContainerProps,
  PokemonEvolutionChainPathProps,
  PokemonEvolutionChainProps,
} from "./pokemon-evolution-chain.types";

function evolutionChainToLevelCountMap(
  { evolvesTo }: EvolutionChainLink,
  chainLevel = 1
): number[] {
  const nextChainLevels = evolvesTo
    .map((evolution) =>
      evolutionChainToLevelCountMap(evolution, chainLevel + 1)
    )
    .flat();

  return [chainLevel, ...nextChainLevels];
}

function getEvolutionChainLinksDisposeDirection(
  evolution: EvolutionChainLink
): "vertical" | "horizontal" {
  const map = evolutionChainToLevelCountMap(evolution).reduce<{
    [K in number]: number;
  }>((prev, acc) => ({ ...prev, [acc]: (prev[acc] ?? 0) + 1 }), {});
  const numberOfChainLevels = Object.keys(map).length;
  const maxEvolutionsInOneLevel = Math.max(...Object.values(map));

  return numberOfChainLevels >= maxEvolutionsInOneLevel
    ? "horizontal"
    : "vertical";
}

function Arrow({
  vertical,
  className,
  ...other
}: PokemonEvolutionChainArrowProps) {
  return (
    <MdKeyboardArrowRight
      {...other}
      size={52}
      className={twMerge(
        "text-slate-400/70 dark:text-slate-500",
        vertical ? "rotate-90" : "mb-5",
        className
      )}
    />
  );
}

function NodeContainer({
  vertical,
  children,
  className,
  ...other
}: PokemonEvolutionChainNodeContainerProps) {
  return (
    <div
      {...other}
      className={twMerge(
        "flex-wrap justify-center items-center",
        vertical ? "flex flex-col space-y-8" : "inline-flex gap-8",
        className
      )}
    >
      {children}
    </div>
  );
}

function EvolutionChainPath({
  evolvesTo,
  isBaby,
  species,
  ...other
}: PokemonEvolutionChainPathProps) {
  return (
    <NodeContainer {...other}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <NodeContainer>
          <Arrow />
          <NodeContainer vertical>
            {evolvesTo.map((evolution) => (
              <EvolutionChainLink key={evolution.species.id} {...evolution} />
            ))}
          </NodeContainer>
        </NodeContainer>
      )}
    </NodeContainer>
  );
}

function EvolutionChainLink({
  evolvesTo,
  isBaby,
  species,
  vertical,
  ...other
}: PokemonEvolutionChainLinkProps) {
  return (
    <NodeContainer {...other} vertical={vertical}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <>
          <Arrow vertical={vertical} />
          <NodeContainer vertical={!vertical}>
            {evolvesTo.map((evolution) => (
              <EvolutionChainPath key={evolution.species.id} {...evolution} />
            ))}
          </NodeContainer>
        </>
      )}
    </NodeContainer>
  );
}

export default function PokemonEvolutionChain({
  children,
  evolutionChain,
  className,
  ...other
}: PokemonEvolutionChainProps) {
  const direction = getEvolutionChainLinksDisposeDirection(evolutionChain);

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
      <EvolutionChainLink
        {...evolutionChain}
        vertical={direction === "vertical"}
        className="p-10"
      />
    </div>
  );
}
