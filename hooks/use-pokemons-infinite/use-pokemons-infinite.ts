import { fetchAsJson, PokemonSpeciesSimple } from "lib";
import { useCallback, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import {
  UsePokemonListArgs,
  UsePokemonListReturn,
} from "./use-pokemons-infinite.types";

export default function usePokemonsInfinite(
  pokemonsPerPage: UsePokemonListArgs
): UsePokemonListReturn {
  const { data, error, size, setSize } = useSWRInfinite<{
    result: PokemonSpeciesSimple[];
  }>(
    (pageIndex) =>
      `/api/pokemon?limit=${pokemonsPerPage}&offset=${
        (pageIndex + 1) * pokemonsPerPage
      }`,
    fetchAsJson,
    {
      revalidateFirstPage: false,
    }
  );

  const loadNext = useCallback(() => {
    setSize((current) => current + 1);
  }, [setSize]);

  return useMemo(() => {
    const isLoadingMore = data ? size > 0 && !data[size - 1] : !error;
    const isEmpty = data?.[0]?.result.length === 0;
    const hasFetchedAll =
      isEmpty ||
      (!!data && data[data.length - 1]?.result.length < pokemonsPerPage);
    const pages = data?.map(({ result }) => result) ?? [];
    const hiddenPage = hasFetchedAll ? [] : pages.pop() ?? [];
    const oldPages = pages.flat();

    return {
      currentPage: size,
      pages: isLoadingMore
        ? [oldPages.concat(...hiddenPage), []]
        : [oldPages, hiddenPage],
      isLoadingMore,
      hasFetchedAll,
      error,
      loadNext,
    };
  }, [data, error, loadNext, pokemonsPerPage, size]);
}
