import { PokemonGrid, PokemonSimpleCard } from "components";
import { useHome, useIntersectionObserver } from "hooks";
import { getPokemons } from "lib";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect } from "react";

const LIMIT = 12;

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ serverLoadedPokemons }: HomeProps) {
  const {
    pages: [visiblePages, hiddenPage],
    hasReachedEnd,
    error,
    loadNext,
  } = useHome(LIMIT);
  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && !hasReachedEnd) loadNext();
  }, [isIntersecting, loadNext, hasReachedEnd]);

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 py-4 bg-slate-50/50">
        <PokemonGrid
          pokemons={[[...serverLoadedPokemons, ...visiblePages], hiddenPage]}
          className="max-w-[1200px] overflow-hidden mx-auto"
        />
        <div
          className="w-full text-center font-light text-slate-400 mb-32"
          ref={intersectionObserverRef}
        >
          {hasReachedEnd ? "These are all the Pokémons" : "Loading..."}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(LIMIT),
    },
  };
}
