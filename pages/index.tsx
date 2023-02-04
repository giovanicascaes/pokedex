import { PokemonView } from "components";
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
      isPokemonListScrollDisabled,
      isPokemonListRendered,
    },
    { loadMore, onPokemonListRendered },
  ] = usePokemonView();

  const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
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
      <div className="px-14 pt-4 h-full pb-[calc(100vh/2)]">
        <PokemonView
          pokemons={[...serverLoadedPokemons, ...visiblePokemons]}
          hiddenPokemons={hiddenPokemons}
          animateCards={!isPokemonListScrollDisabled}
          onListRendered={onPokemonListRendered}
          onInitialAnimationsDone={() => {}}
          className="mx-auto"
        />
        <div
          className="w-full text-center font-light text-slate-400"
          ref={intersectionObserverRef}
        >
          {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
        </div>
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
