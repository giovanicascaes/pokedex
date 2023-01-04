import { PokemonEvolutionChainLinkCard } from "components/pokemon-evolution-chain-link-card";
import { EvolutionChainLink } from "lib";
import { MdKeyboardArrowRight } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import {
  PokemonEvolutionChainArrowProps,
  PokemonEvolutionChainLinkProps,
  PokemonEvolutionChainNodeContainerProps,
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

function getEvolutionChainNodesDisposeDirection(
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
        "fill-slate-500",
        vertical ? "rotate-90" : "mb-5",
        className
      )}
    />
  );
}

function NodeContainer({
  children,
  className,
  vertical,
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
}: PokemonEvolutionChainLinkProps) {
  return (
    <NodeContainer {...other}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <NodeContainer>
          <Arrow />
          <NodeContainer vertical>
            {evolvesTo.map((evolution) => (
              <EvolutionChainLinkHorizontal
                key={evolution.species.id}
                {...evolution}
              />
            ))}
          </NodeContainer>
        </NodeContainer>
      )}
    </NodeContainer>
  );
}

function EvolutionChainLinkHorizontal({
  evolvesTo,
  isBaby,
  species,
  ...other
}: PokemonEvolutionChainLinkProps) {
  return (
    <NodeContainer {...other}>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <>
          <Arrow />
          <NodeContainer vertical>
            {evolvesTo.map((evolution) => (
              <EvolutionChainPath key={evolution.species.id} {...evolution} />
            ))}
          </NodeContainer>
        </>
      )}
    </NodeContainer>
  );
}

function EvolutionChainLinkVertical({
  evolvesTo,
  isBaby,
  species,
  ...other
}: PokemonEvolutionChainLinkProps) {
  return (
    <NodeContainer {...other} vertical>
      <PokemonEvolutionChainLinkCard pokemon={species} isBaby={isBaby} />
      {evolvesTo.length > 0 && (
        <>
          <Arrow vertical />
          <NodeContainer>
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
  const direction = getEvolutionChainNodesDisposeDirection(evolutionChain);
  const initialChainProps = { ...{ ...evolutionChain }, className: "p-10" };

  return (
    <div
      {...other}
      className={twMerge("flex flex-col bg-slate-200/40 rounded-xl", className)}
    >
      {evolutionChain.evolvesTo.length === 0 && (
        <span className="text-slate-500 text-sm mt-4 text-center">
          This pokemon does not evolve
        </span>
      )}
      {direction === "vertical" ? (
        <EvolutionChainLinkVertical {...initialChainProps} />
      ) : (
        <EvolutionChainLinkHorizontal {...initialChainProps} />
      )}
    </div>
  );
}
