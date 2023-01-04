import { Badge } from "components/badge";
import { PokemonArt } from "components/pokemon-art";
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
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50 focus-visible:rounded-full"
      >
        <div
          {...other}
          className={twMerge(
            "rounded-full bg-slate-200 p-5 border-4 border-white shadow-md",
            className
          )}
        >
          <PokemonArt {...{ artSrc, name }} width={110} height={110} />
        </div>
      </Link>
      <span className="flex items-center text-sm space-x-0.5 mt-3">
        <span className="text-slate-400 font-light">#{id}</span>
        <span className="text-slate-600 font-medium truncate">{name}</span>
        {isBaby && <Badge color="red">Baby</Badge>}
      </span>
    </div>
  );
}
