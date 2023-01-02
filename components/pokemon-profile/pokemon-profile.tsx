import { animated, useTransition } from "@react-spring/web";
import { Ability } from "lib";
import { ReactNode, useMemo, useState } from "react";
import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
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
      <span className="text-xs uppercase font-semibold text-slate-400">
        {title}
      </span>
      <div className="text-xl text-slate-700">{children}</div>
    </div>
  );
}

function DataUnit({ children }: { children: ReactNode }) {
  return <span className="text-sm">{children}</span>;
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
  const [displayingAbility, setDisplayingAbility] = useState<
    Ability | undefined
  >();

  const genderIcons = useMemo(() => {
    const maleIcon = <IoMaleOutline size={28} />;
    const femaleIcon = <IoFemaleOutline size={28} />;

    return match(
      {
        male: maleIcon,
        female: femaleIcon,
        both: (
          <div className="flex space-x-1">
            {maleIcon}
            {femaleIcon}
          </div>
        ),
        unknown: "Unknown",
      },
      gender
    );
  }, [gender]);

  const transition = useTransition(displayingAbility, {
    config: { duration: 150 },
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
  });

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
                  <div
                    onClick={() => setDisplayingAbility(ability)}
                    className="bg-gray-200 text-slate-700 rounded-full cursor-pointer w-5 h-5 flex items-center justify-center text-base ml-1.5"
                  >
                    ?
                  </div>
                </div>
              );
            })}
        </div>
      </DataContainer>
      <DataContainer title="Gender">{genderIcons}</DataContainer>
      {transition(
        (styles, ability) =>
          ability && (
            <animated.div
              className="absolute z-10 top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-slate-700/70 border border-slate-600/70 backdrop-blur-md rounded-md"
              style={{ ...styles }}
            >
              <div className="text-slate-300 text-sm flex flex-col h-full">
                <span className="text-2xl mb-5 text-white px-6 pt-6">
                  {ability?.name}
                </span>
                <button
                  onClick={() => setDisplayingAbility(undefined)}
                  className="absolute z-10 top-3 right-3 text-slate-300 hover:text-slate-200 p-0.5 rounded cursor-pointer bg-slate-600 hover:bg-slate-700 transition-colors"
                >
                  <MdClose size={20} />
                </button>
                <span className="overflow-auto px-6 pb-6">{ability?.description}</span>
              </div>
            </animated.div>
          )
      )}
    </div>
  );
}
