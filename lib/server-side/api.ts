import { fetchAsJson } from "lib/fetch";
import { join, pick } from "utils";
import {
  ApiNamedResourceList,
  ApiPokemon,
  ApiPokemonSpecies,
  PokemonSimple,
} from "./api.types";

const DEFAULT_LIMIT = 20;

const BASE_URL = "https://pokeapi.co/api/v2";

async function fetchPathAsJson<T>(path: string) {
  return fetchAsJson<T>(`${BASE_URL}${path}`);
}

async function toPokemonSimple({
  species: { url },
  sprites,
  ...rest
}: ApiPokemon): Promise<PokemonSimple> {
  const { names } = await fetchAsJson<ApiPokemonSpecies>(url);

  return {
    ...pick(rest, "id"),
    artSrc: sprites.other["official-artwork"].front_default,
    name: names.find(({ language }) => language.name === "en")!.name,
  };
}

export async function getPokemons(
  limit: number = DEFAULT_LIMIT,
  offset?: number
) {
  const { results } = await fetchPathAsJson<ApiNamedResourceList>(
    join(`/pokemon?limit=${limit}`, offset && `&offset=${offset}`)
  );
  console.log("🚀 ~ file: api.ts:37 ~ results", results);
  return Promise.all(
    results.map(({ url }) => fetchAsJson<ApiPokemon>(url).then(toPokemonSimple))
  );
}
