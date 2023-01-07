import { AbilityOverlay } from "components/ability-overlay";
import { Ability } from "lib";
import { ReactNode, useMemo, useState } from "react";
import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { match } from "utils";
import { PokemonProfileProps } from "./pokemon-profile.types";

function DataContainer({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <span className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-400/90">
        {title}
      </span>
      <div className="text-md text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </div>
  );
}

function DataUnit({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm font-light text-slate-500 dark:text-slate-300">
      {children}
    </span>
  );
}

export default function PokemonProfile({
  abilities,
  gender,
  height,
  shape,
  weight,
  className,
  ...other
}: PokemonProfileProps) {
  const [displayingAbility, setDisplayingAbility] = useState<Ability>();

  const genderIcons = useMemo(() => {
    const maleIcon = <IoMaleOutline size={28} />;
    const femaleIcon = <IoFemaleOutline size={28} />;

    return match(
      {
        male: maleIcon,
        female: femaleIcon,
        both: (
          <div className="flex space-x-1.5">
            {maleIcon}
            {femaleIcon}
          </div>
        ),
        unknown: "Unknown",
      },
      gender
    );
  }, [gender]);

  return (
    <div
      {...other}
      className={twMerge("grid grid-cols-2 gap-4 relative", className)}
    >
      <DataContainer title="Height">
        {height / 10} <DataUnit>m</DataUnit>
      </DataContainer>
      <DataContainer title="Category">{shape}</DataContainer>
      <DataContainer title="Weight">
        {weight / 10} <DataUnit>kg</DataUnit>
      </DataContainer>
      <DataContainer title="Abilities">
        <div className="flex flex-col">
          {abilities
            .sort(({ slot: slot1 }, { slot: slot2 }) =>
              slot1 < slot2 ? -1 : 1
            )
            .map((ability) => {
              const { name } = ability;

              return (
                <div key={name} className="flex items-center">
                  {name}
                  {ability.description && (
                    <button
                      onClick={() => setDisplayingAbility(ability)}
                      className="bg-gray-200 dark:bg-gray-600 text-slate-700 dark:text-slate-300/90 rounded-full cursor-pointer w-5 h-5 flex items-center justify-center text-base ml-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50"
                    >
                      ?
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </DataContainer>
      <DataContainer title="Gender">{genderIcons}</DataContainer>
      <AbilityOverlay
        ability={displayingAbility}
        onClose={() => setDisplayingAbility(undefined)}
      />
    </div>
  );
}
