import { PokemonList } from "components"
import { POKEMONS_PER_PAGE, usePokemon, useScrollControl } from "contexts"
import { useIntersectionObserver } from "hooks"
import { getPokemons, SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { InferGetStaticPropsType } from "next"
import Head from "next/head"
import { ReactNode, useCallback, useEffect, useState } from "react"
import { env } from "utils"

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ serverLoadedPokemons }: HomeProps) {
  const [isListLoaded, setIsListLoaded] = useState(false)
  const [
    { visiblePokemons, preloadPokemons, hasFetchedAll },
    { loadMore, addPokemonToPokedex, removePokemonFromPokedex },
  ] = usePokemon(serverLoadedPokemons)
  const [{ isScrollVisited }, { onPageLoadComplete }] = useScrollControl()
  const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
    root: env.isServer
      ? null
      : document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!,
    rootMargin: "50%",
  })

  const onListLoad = useCallback(() => {
    setIsListLoaded(true)
    onPageLoadComplete()
  }, [onPageLoadComplete])

  useEffect(() => {
    if (isIntersecting && !hasFetchedAll) loadMore()
  }, [isIntersecting, loadMore, hasFetchedAll])

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 pt-4 h-full pb-8">
        <PokemonList
          pokemons={visiblePokemons}
          preloadPokemons={preloadPokemons}
          skipInitialAnimation={isScrollVisited}
          onAddToPokedex={addPokemonToPokedex}
          onRemoveFromPokedex={removePokemonFromPokedex}
          onLoad={onListLoad}
          className="mx-auto"
        />
        {isListLoaded && (
          <div
            className="w-full text-center font-light text-slate-400"
            ref={intersectionObserverRef}
          >
            {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
          </div>
        )}
      </div>
    </>
  )
}

Home.restoreScrollOnNavigatingFrom = ["/pokemon/[key]"]

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(POKEMONS_PER_PAGE),
    },
  }
}
