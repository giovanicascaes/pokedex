import { PokemonList } from "components";
import { POKEMONS_PER_PAGE, usePokemonView } from "contexts";
import { useIntersectionObserver } from "hooks";
import { getPokemons } from "lib";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect } from "react";

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Home({ serverLoadedPokemons }: HomeProps) {
  const [
    {
      visiblePokemons,
      hiddenPokemons,
      hasFetchedAll,
      isPokemonListScrollEnabled,
      isPokemonListRendered,
    },
    { loadMore, onPokemonListRendered },
  ] = usePokemonView();

  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver({
      rootMargin: "20%",
    });

  useEffect(() => {
    if (isIntersecting && !hasFetchedAll) loadMore();
  }, [isIntersecting, loadMore, hasFetchedAll]);

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 py-4 h-full">
        <PokemonList
          pokemons={[...serverLoadedPokemons, ...visiblePokemons]}
          hiddenPokemons={hiddenPokemons}
          animateCards={isPokemonListScrollEnabled}
          onListRendered={onPokemonListRendered}
          className="max-w-[1200px] mx-auto"
        />
        {isPokemonListRendered && (
          <div
            className="w-full text-center font-light text-slate-400 mb-10"
            ref={intersectionObserverRef}
          >
            {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(POKEMONS_PER_PAGE),
    },
  };
}
