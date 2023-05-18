import { PokemonList } from "components"
import { POKEMONS_PER_PAGE, usePokemon, useScrollControl } from "contexts"
import { useIntersectionObserver } from "hooks"
import { getPokemons, SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { InferGetStaticPropsType } from "next"
import Head from "next/head"
import { useCallback, useEffect, useState } from "react"
import { env } from "utils"

type PokemonsProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Pokemons({ serverLoadedPokemons }: PokemonsProps) {
  const [isListLoaded, setIsListLoaded] = useState(false)
  const [
    { visible, preload, hasFetchedAll },
    { loadMore, addPokemonToPokedex, removePokemonFromPokedex },
  ] = usePokemon(serverLoadedPokemons)
  const [{ isPreviousScrollSaved }, { onPageLoadComplete }] = useScrollControl()
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
      <div className="flex flex-col px-14 pt-4 pb-8">
        <PokemonList
          pokemons={visible}
          preload={preload}
          skipFirstItemsAnimation={isPreviousScrollSaved}
          onCatch={addPokemonToPokedex}
          onRelease={removePokemonFromPokedex}
          onLoad={onListLoad}
          className="mx-auto"
        />
        {isListLoaded && (
          <div
            className="w-full text-center font-light text-slate-400 mt-10"
            ref={intersectionObserverRef}
          >
            {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
          </div>
        )}
      </div>
    </>
  )
}

Pokemons.restoreScrollOnNavigatingFrom = ["/pokemon/[key]"]

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(POKEMONS_PER_PAGE),
    },
  }
}
