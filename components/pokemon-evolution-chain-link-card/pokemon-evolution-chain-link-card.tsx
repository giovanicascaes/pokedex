import { Badge, PokemonArt } from "components";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PokemonEvolutionChainLinkCardProps } from "./pokemon-evolution-chain-link-card.types";

export default function PokemonEvolutionChainLinkCard({
  pokemon: { artSrc, id, name, resourceName },
  isBaby,
  className,
  ...other
}: PokemonEvolutionChainLinkCardProps) {
  return (
    <div className="flex flex-col items-center">
      <Link
        href={`/pokemon/${resourceName}`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 focus-visible:rounded-full"
      >
        <div
          {...other}
          className={twMerge(
            "rounded-full bg-slate-300/70 dark:bg-slate-500/50 p-4 border-4 border-white dark:border-slate-200/70 shadow-md dark:shadow-black/50",
            className
          )}
        >
          <PokemonArt {...{ artSrc, name }} width={110} height={110} />
        </div>
      </Link>
      <span className="flex items-baseline text-sm mt-3">
        <span className="text-slate-400 dark:text-slate-300 font-light mr-0.5">
          #{id}
        </span>
        <span className="text-slate-600 dark:text-slate-100 font-medium mr-1.5 truncate">
          {name}
        </span>
        {isBaby && (
          <Badge color="red" variant="rounded">
            Baby
          </Badge>
        )}
      </span>
    </div>
  );
}