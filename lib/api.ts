import { fetchAsJson } from "lib/fetch";
import { join, pick } from "utils";
import {
  Ability,
  ApiAbility,
  ApiEvolutionChain,
  ApiEvolutionChainLink,
  ApiLocalized,
  ApiNamedResource,
  ApiNamedResourceList,
  ApiPokemon,
  ApiPokemonAbility,
  ApiPokemonForm,
  ApiPokemonSpecies,
  ApiPokemonSpeciesVariety,
  ApiPokemonSprites,
  ApiPokemonStat,
  ApiPokemonType,
  ApiResourced,
  ApiStat,
  ApiType,
  EvolutionChainLink,
  PokemonGender,
  PokemonSpeciesDetailed,
  PokemonSpeciesSimple,
  PokemonVariety,
  Stat,
  Type,
  TypeRelation,
  TypeValue,
} from "./api.types";

const DEFAULT_LIMIT = 20;

const DEFAULT_LANGUAGE = "en";

const BASE_URL = "https://pokeapi.co/api/v2";

export const ApiTypesColors: {
  [K in TypeValue]: Type["color"];
} = {
  normal: "#A4ACAF",
  fighting: "#D46822",
  flying: ["#4FC6F0", "#BDBAB7"],
  poison: "#B97FCA",
  ground: ["#F7DE40", "#AB9842"],
  rock: "#A38C20",
  bug: "#729F3F",
  ghost: "#7B61A3",
  steel: "#9EB8B8",
  fire: "#F37D24",
  water: "#4592C5",
  grass: "#9BCC50",
  electric: "#EED535",
  psychic: "#F366B9",
  ice: "#51C4E7",
  dragon: ["#52A4CF", "#F16E56"],
  dark: "#707071",
  fairy: "#F9B9E9",
  unknown: null,
  shadow: null,
};

async function fetchPathAsJson<T>(path: string) {
  return fetchAsJson<T>(`${BASE_URL}${path}`);
}

function getLocalizedName({ names }: ApiLocalized) {
  return names.find(({ language }) => language.name === DEFAULT_LANGUAGE)?.name;
}

function getOfficialArtwork(sprites: ApiPokemonSprites) {
  return sprites.other["official-artwork"].front_default;
}

async function toPokemonSpeciesSimple(
  species: ApiPokemonSpecies
): Promise<PokemonSpeciesSimple> {
  const { varieties, ...rest } = species;
  const { pokemon } = varieties.find(({ is_default }) => is_default)!;
  const { sprites } = await fetchAsJson<ApiPokemon>(pokemon.url);

  return {
    ...pick(rest, "id"),
    artSrc: getOfficialArtwork(sprites),
    name: getLocalizedName(species)!,
  };
}

export async function getPokemons(
  limit: number = DEFAULT_LIMIT,
  offset?: number
): Promise<PokemonSpeciesSimple[]> {
  const { results } = await fetchPathAsJson<ApiNamedResourceList>(
    join(`/pokemon-species?limit=${limit}`, offset && `&offset=${offset}`)
  );
  return Promise.all(
    results.map(({ url }) =>
      fetchAsJson<ApiPokemonSpecies>(url).then(toPokemonSpeciesSimple)
    )
  );
}

async function toAbility({
  ability: { url },
  is_hidden,
  ...other
}: ApiPokemonAbility): Promise<Ability> {
  const ability = await fetchAsJson<ApiAbility>(url);
  const { effect_entries } = ability;

  return {
    ...pick(other, "slot"),
    name: getLocalizedName(ability)!,
    description: effect_entries.find(
      ({ language }) => language.name === DEFAULT_LANGUAGE
    )!.effect,
    isHidden: is_hidden,
  };
}

async function toPokemonForm({ url }: ApiNamedResource) {
  return fetchAsJson<ApiPokemonForm>(url);
}

async function toStat({
  base_stat,
  stat: { url },
}: ApiPokemonStat): Promise<Stat> {
  const stat = await fetchAsJson<ApiStat>(url);

  return {
    name: getLocalizedName(stat)!,
    value: base_stat,
  };
}

async function namedResourceToType<T extends Type | TypeRelation = Type>(
  { url }: ApiNamedResource,
  includeDamageRelations: boolean = true
): Promise<Omit<T, "slot">> {
  const type = await fetchAsJson<ApiType>(url);
  const {
    name,
    damage_relations: {
      double_damage_from,
      double_damage_to,
      half_damage_from,
      half_damage_to,
      no_damage_from,
      no_damage_to,
    },
  } = type;
  const value = name as TypeValue;

  return {
    value,
    name: getLocalizedName(type)!,
    ...(includeDamageRelations && {
      damageRelations: {
        doubleDamageFrom: await Promise.all(
          double_damage_from.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
        doubleDamageTo: await Promise.all(
          double_damage_to.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
        halfDamageFrom: await Promise.all(
          half_damage_from.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
        halfDamageTo: await Promise.all(
          half_damage_to.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
        noDamageFrom: await Promise.all(
          no_damage_from.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
        noDamageTo: await Promise.all(
          no_damage_to.map((damage) =>
            namedResourceToType<TypeRelation>(damage, false)
          )
        ),
      },
    }),
    color: ApiTypesColors[value],
  } as T;
}

async function toType({ type, ...other }: ApiPokemonType): Promise<Type> {
  return {
    ...pick(other, "slot"),
    ...(await namedResourceToType(type)),
  };
}

async function toPokemonVariety({
  is_default,
  pokemon,
}: ApiPokemonSpeciesVariety): Promise<PokemonVariety> {
  const { abilities, stats, types, sprites, forms, ...rest } =
    await fetchAsJson<ApiPokemon>(pokemon.url);
  const defaultForm = (await Promise.all(forms.map(toPokemonForm))).find(
    ({ is_default }) => is_default
  )!;

  return {
    ...pick(rest, "id", "height", "weight"),
    artSrc: getOfficialArtwork(sprites),
    name: getLocalizedName(defaultForm) ?? null,
    isDefault: is_default,
    abilities: (await Promise.all(abilities.map(toAbility))).sort(
      ({ slot: slot1 }, { slot: slot2 }) => (slot1 < slot2 ? -1 : 1)
    ),
    stats: await Promise.all(stats.map(toStat)),
    types: await Promise.all(types.map(toType)),
  };
}

async function toEvolutionChainLink({
  evolves_to,
  is_baby,
  species: { url },
}: ApiEvolutionChainLink): Promise<EvolutionChainLink> {
  const species = await fetchAsJson<ApiPokemonSpecies>(url);

  return {
    isBaby: is_baby,
    species: await toPokemonSpeciesSimple(species),
    evolvesTo: await Promise.all(evolves_to.map(toEvolutionChainLink)),
  };
}

async function toEvolutionChain({
  url,
}: ApiResourced): Promise<EvolutionChainLink> {
  const { chain } = await fetchAsJson<ApiEvolutionChain>(url);

  return toEvolutionChainLink(chain);
}

function toGender(
  gender_rate: ApiPokemonSpecies["gender_rate"]
): PokemonGender {
  switch (gender_rate) {
    case -1:
      return "unknown";
    case 0:
      return "male";
    case 8:
      return "female";
    default:
      return "both";
  }
}

async function toPokemonSpeciesDetailed(
  species: ApiPokemonSpecies
): Promise<PokemonSpeciesDetailed> {
  const {
    is_baby,
    is_legendary,
    is_mythical,
    gender_rate,
    varieties,
    evolution_chain,
    ...rest
  } = species;
  return {
    ...pick(rest, "id"),
    name: getLocalizedName(species)!,
    isBaby: is_baby,
    isLegendary: is_legendary,
    isMythical: is_mythical,
    gender: toGender(gender_rate),
    varieties: await Promise.all(varieties.map(toPokemonVariety)),
    evolutionChain: await toEvolutionChain(evolution_chain),
  };
}

export async function getPokemon(key: string): Promise<PokemonSpeciesDetailed> {
  const species = await fetchPathAsJson<ApiPokemonSpecies>(
    `/pokemon-species/${key}`
  );

  return toPokemonSpeciesDetailed(species);
}
