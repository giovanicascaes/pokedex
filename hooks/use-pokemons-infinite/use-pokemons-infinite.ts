import { fetchAsJson, PokemonSpeciesSimple } from "lib"
import { useCallback, useMemo } from "react"
import useSWRInfinite from "swr/infinite"
import {
  UsePokemonInfiniteArgs,
  UsePokemonInfinitePokemons,
  UsePokemonInfiniteReturn,
} from "./use-pokemons-infinite.types"

export default function usePokemonsInfinite(
  pokemonsPerPage: UsePokemonInfiniteArgs
): UsePokemonInfiniteReturn {
  const { data, error, size, setSize } = useSWRInfinite<{
    result: PokemonSpeciesSimple[]
  }>(
    (pageIndex) =>
      `/api/pokemon?limit=${pokemonsPerPage}&offset=${
        (pageIndex + 1) * pokemonsPerPage
      }`,
    fetchAsJson,
    {
      revalidateFirstPage: false,
    }
  )

  const loadNext = useCallback(() => {
    setSize((current) => current + 1)
  }, [setSize])

  const isLoadingMore = data ? size > 0 && !data[size - 1] : !error
  const isEmpty = data?.[0]?.result.length === 0
  const hasFetchedAll =
    isEmpty ||
    (!!data && data[data.length - 1]?.result.length < pokemonsPerPage)
  const pages = useMemo(() => data?.map(({ result }) => result) ?? [], [data])
  const hiddenPage = useMemo(
    () => (hasFetchedAll ? [] : pages.pop() ?? []),
    [hasFetchedAll, pages]
  )

  const pokemons = useMemo<UsePokemonInfinitePokemons>(() => {
    const oldPages = pages.flat()

    if (isLoadingMore) {
      return [oldPages.concat(...hiddenPage), []]
    }

    return [oldPages, hiddenPage]
  }, [hiddenPage, isLoadingMore, pages])

  return {
    currentPage: size,
    pokemons,
    isLoadingMore,
    hasFetchedAll,
    error,
    loadNext,
  }
}
