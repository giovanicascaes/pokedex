import {
  Badge,
  FadeOnChange,
  PokemonArt,
  PokemonEvolutionChain,
  PokemonNavigationButton,
  PokemonProfile,
  PokemonSection,
  PokemonStats,
  PokemonTypeSections,
  Select,
} from "components";
import { Children, isValidElement, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  PokemonDetailsBadges,
  PokemonDetailsProps,
} from "./pokemon-details.types";

function SpeciesBadgeContainer({
  children,
  className,
  ...other
}: PokemonDetailsBadges) {
  return Children.toArray(children).filter(isValidElement).length > 0 ? (
    <div {...other} className={twMerge("flex space-x-2", className)}>
      {children}
    </div>
  ) : null;
}

export default function PokemonDetails({
  pokemon: {
    color,
    evolutionChain,
    gender,
    id,
    isBaby,
    isLegendary,
    isMythical,
    name,
    nextPokemon,
    previousPokemon,
    resourceName,
    shape,
    varieties,
  },
}: PokemonDetailsProps) {
  const [selectedForm, setSelectedForm] = useState(varieties[0]);
  const displayedFormName = selectedForm.name ?? name;

  useEffect(() => {
    setSelectedForm(varieties[0]);
  }, [varieties]);

  return (
    <>
      <div className="flex w-full">
        {previousPokemon && (
          <PokemonNavigationButton toPokemon={previousPokemon} />
        )}
        {nextPokemon && (
          <PokemonNavigationButton
            toPokemon={nextPokemon}
            forwards
            className="ml-auto"
          />
        )}
      </div>
      <div className="flex flex-col items-center">
        <span className="space-x-2 text-center text-4xl">
          <span className="text-slate-600 dark:text-slate-400 font-light">
            #{id}
          </span>
          <span className="text-slate-800 dark:text-slate-100 font-medium">
            {name}
          </span>
        </span>
        <SpeciesBadgeContainer className="mt-4">
          {isBaby && <Badge color="red">Baby</Badge>}
          {isLegendary && <Badge color="pink">Legendary</Badge>}
          {isMythical && <Badge color="yellow">Mythical</Badge>}
        </SpeciesBadgeContainer>
        {varieties.length > 1 && (
          <Select
            value={selectedForm}
            onChange={setSelectedForm}
            by="id"
            className="max-w-[320px] mt-8 relative"
          >
            <Select.Button>
              <div className="flex items-baseline w-full">
                {displayedFormName}
                {selectedForm.isMega && (
                  <Badge
                    color="purple"
                    variant="rounded"
                    className="w-min ml-2.5"
                  >
                    Mega
                  </Badge>
                )}
              </div>
            </Select.Button>
            <Select.Options className="max-h-[350px] overflow-y-auto">
              {varieties.map((variety) => (
                <Select.Option key={variety.id} value={variety}>
                  <div className="flex items-baseline">
                    {variety.name ?? name}
                    {variety.isMega && (
                      <Badge
                        color="purple"
                        variant="rounded"
                        className="w-min ml-2.5"
                      >
                        Mega
                      </Badge>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
        )}
        <FadeOnChange
          watchChangesOn={selectedForm}
          className="w-full relative flex justify-center"
        >
          {({ abilities, artSrc, height, stats, types, weight }) => (
            <div className="flex flex-1 space-x-16 mt-28">
              <div className="space-y-8">
                <div
                  className="h-min rounded-md"
                  style={{ backgroundColor: color }}
                >
                  <PokemonArt
                    artSrc={artSrc}
                    width={450}
                    height={450}
                    name={displayedFormName}
                    className="rounded-md bg-white/75 dark:bg-slate-400/70 pb-8 pt-4 outline outline-1 -outline-offset-1 outline-black/[0.14] dark:outline-white/[0.28]"
                  />
                </div>
                <PokemonSection label="Stats" className="mt-8">
                  <PokemonStats>
                    {stats.map(({ name: statName, value }) => (
                      <PokemonStats.Meter
                        key={statName}
                        label={statName}
                        totalBars={15}
                        value={value}
                        barContainerClassName="h-[220px]"
                      />
                    ))}
                  </PokemonStats>
                </PokemonSection>
              </div>
              <div className="space-y-8 w-full">
                <PokemonSection label="Profile">
                  <PokemonProfile
                    {...{ height, weight, shape, abilities, gender }}
                  />
                </PokemonSection>
                <PokemonTypeSections types={types} />
              </div>
            </div>
          )}
        </FadeOnChange>
        <div className="w-full">
          <PokemonSection label="Evolution Chain" className="mt-12">
            <PokemonEvolutionChain evolutionChain={evolutionChain} />
          </PokemonSection>
        </div>
      </div>
    </>
  );
}
