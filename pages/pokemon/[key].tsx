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
import { getPokemon } from "lib";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import {
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  isValidElement,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function SpeciesBadgeContainer({
  children,
  className,
  ...other
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return Children.toArray(children).filter(isValidElement).length > 0 ? (
    <div {...other} className={twMerge("flex space-x-2", className)}>
      {children}
    </div>
  ) : null;
}

export default function Pokemon({
  pokemon: {
    evolutionChain,
    gender,
    id,
    isBaby,
    isLegendary,
    isMythical,
    name,
    varieties,
    color,
    shape,
    previousPokemon,
    nextPokemon,
  },
}: PokemonProps) {
  const [selectedForm, setSelectedForm] = useState(varieties[0]);
  const {
    abilities,
    artSrc,
    height,
    isMega,
    name: formName,
    stats,
    types,
    weight,
  } = selectedForm;
  const displayedFormName = formName ?? name;

  useEffect(() => {
    setSelectedForm(varieties[0]);
  }, [varieties]);

  return (
    <>
      <Head>
        <title>{`${name} | A Pokédex`}</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-32 pb-12 pt-8 h-full overflow-x-hidden space-y-12">
        <FadeOnChange animationKey={id}>
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
        </FadeOnChange>
        <div className="flex flex-col items-center">
          <FadeOnChange animationKey={id}>
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
                    {isMega && (
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
          </FadeOnChange>
          <FadeOnChange
            animationKey={selectedForm}
            className="w-full relative flex justify-center"
          >
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
                    className="rounded-md bg-white/75 dark:bg-slate-400/70 pb-8 pt-4 outline outline-1 -outline-offset-1 outline-black/[0.12] dark:outline-white/[0.28]"
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
          </FadeOnChange>
          <div className="w-full">
            <PokemonSection label="Evolution Chain" className="mt-12">
              <PokemonEvolutionChain evolutionChain={evolutionChain} />
            </PokemonSection>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ key: string }>) {
  const pokemon = await getPokemon(params!.key);

  if (!pokemon) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pokemon,
    },
  };
}
