import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PokemonCardProps } from "./pokemon-card.types";

export default function PokemonSimpleCard({
  identifier: id,
  artSrc,
  name,
  onClick,
  className,
  ...otherProps
}: PokemonCardProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={twMerge(
        className,
        "flex flex-col items-center space-y-2 [perspective:1000px]"
      )}
      {...otherProps}
    >
      <div
        className="flex px-4 py-10 shadow-md rounded-lg bg-white cursor-pointer hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] active:translate-y-2 hover:shadow-2xl transition-all"
        onClick={onClick}
      >
        {artSrc && !error ? (
          <div className="flex items-center justify-center min-w-[220px] min-h-[220px]">
            <Image
              src={artSrc}
              alt={`${name}'s art`}
              width={220}
              height={220}
              onError={() => setError(true)}
            />
          </div>
        ) : (
          <span className="min-w-[220px] h-[220px] text-[200px] leading-[200px] text-center text-slate-600">
            ?
          </span>
        )}
      </div>
      <span className="text-slate-400 text-sm font-semibold">#{id}</span>
      <span className="text-slate-600 text-2xl font-light truncate">
        {name}
      </span>
    </div>
  );
}
