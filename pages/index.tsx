import { PokemonSimpleCard } from "components";
import { useHome, useIntersectionObserver } from "hooks";
import { server } from "lib";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect } from "react";

const LIMIT = 19;

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

const pokemonToCard = ({ id, ...other }: server.PokemonSimple) => (
  <PokemonSimpleCard key={id} {...other} identifier={id} />
);

export default function Home({ serverLoadedPokemons }: HomeProps) {
  const {
    pages: [visiblePages, lastPage, hiddenPage],
    isLoadingMore,
    error,
    loadNext,
  } = useHome(LIMIT);
  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting) loadNext();
  }, [isIntersecting, loadNext]);

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 py-4 bg-slate-50/50">
        <div className="grid auto-rows-auto auto-cols-max grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 max-w-[1200px] overflow-hidden p-10 mx-auto">
          {[...serverLoadedPokemons, ...visiblePages, ...lastPage].map(
            pokemonToCard
          )}
          {hiddenPage.length > 0 && (
            <div className="hidden">{hiddenPage.map(pokemonToCard)}</div>
          )}
        </div>
        <div
          className="w-full text-center font-light text-slate-400 mb-32"
          ref={intersectionObserverRef}
        >
          Loading...
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await server.getPokemons(LIMIT),
    },
  };
}
