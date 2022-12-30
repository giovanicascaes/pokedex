import { WithOptional } from "types";

export type ApiOptional<T> = T | null;

export interface ApiNamed {
  name: string;
}

export interface ApiIdentified {
  id: number;
}

export type ApiLanguage = ApiNamed;

export interface ApiName {
  name: string;
  language: ApiLanguage;
}

export interface ApiLocalized {
  names: ApiName[];
}

export type ApiResource = string;

export interface ApiResourced {
  url: ApiResource;
}

export interface ApiNamedResource extends ApiNamed, ApiResourced {}

export interface ApiPagination {
  count: number;
  next: ApiOptional<ApiResource>;
  previous: ApiOptional<ApiResource>;
}

export interface ApiNamedResourceList extends ApiPagination {
  results: ApiNamedResource[];
}

export interface ApiVerboseEffect {
  effect: string;
  short_effect: string;
  language: ApiNamedResource;
}

export interface ApiAbility extends ApiIdentified, ApiLocalized {
  effect_entries: ApiVerboseEffect[];
}

export interface ApiStat extends ApiIdentified, ApiLocalized {}

export interface ApiTypeRelations {
  no_damage_to: ApiNamedResource[];
  half_damage_to: ApiNamedResource[];
  double_damage_to: ApiNamedResource[];
  no_damage_from: ApiNamedResource[];
  half_damage_from: ApiNamedResource[];
  double_damage_from: ApiNamedResource[];
}

export interface ApiType extends ApiNamed, ApiLocalized {
  damage_relations: ApiTypeRelations;
}

export interface ApiPokemonSprites {
  back_default: ApiOptional<ApiResource>;
  back_female: ApiOptional<ApiResource>;
  back_shiny: ApiOptional<ApiResource>;
  back_shiny_female: ApiOptional<ApiResource>;
  front_default: ApiOptional<ApiResource>;
  front_female: ApiOptional<ApiResource>;
  front_shiny: ApiOptional<ApiResource>;
  front_shiny_female: ApiOptional<ApiResource>;
  other: {
    "official-artwork": {
      front_default: ApiResource;
    };
  };
}

export interface ApiPokemonAbility {
  is_hidden: boolean;
  ability: ApiNamedResource;
  slot: number;
}

export interface ApiPokemonStat {
  stat: ApiNamedResource;
  base_stat: number;
}

export interface ApiPokemonType {
  type: ApiNamedResource;
  slot: number;
}

export interface ApiPokemonForm extends ApiNamed, ApiLocalized {
  is_default: boolean;
}

export interface ApiPokemon extends ApiNamed, ApiIdentified {
  height: number;
  weight: number;
  is_default: boolean;
  sprites: ApiPokemonSprites;
  abilities: ApiPokemonAbility[];
  stats: ApiPokemonStat[];
  types: ApiPokemonType[];
  forms: ApiNamedResource[];
}

export interface ApiPokemonSpeciesVariety {
  is_default: boolean;
  pokemon: ApiNamedResource;
}

export interface ApiEvolutionChainLink {
  is_baby: boolean;
  species: ApiNamedResource;
  evolves_to: ApiEvolutionChainLink[];
}

export interface ApiEvolutionChain extends ApiIdentified {
  chain: ApiEvolutionChainLink;
}

export interface ApiPokemonSpecies
  extends ApiNamed,
    ApiIdentified,
    ApiLocalized {
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  gender_rate: number;
  varieties: ApiPokemonSpeciesVariety[];
  evolution_chain: ApiResourced;
}

export interface PokemonSpeciesSimple {
  id: number;
  artSrc: string;
  name: string;
}

export interface Ability {
  name: string;
  description: string;
  isHidden: boolean;
  slot: number;
}

export interface Stat {
  name: string;
  value: number;
}

export type TypeRelation = Omit<Type, "slot" | "damageRelations">;

export interface TypeRelations {
  noDamageTo: TypeRelation[];
  halfDamageTo: TypeRelation[];
  doubleDamageTo: TypeRelation[];
  noDamageFrom: TypeRelation[];
  halfDamageFrom: TypeRelation[];
  doubleDamageFrom: TypeRelation[];
}

export type TypeValue =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "unknown"
  | "shadow";

export interface Type {
  value: TypeValue;
  name: string;
  damageRelations: TypeRelations;
  color: string | [string, string] | null;
  slot: number;
}

export interface PokemonVariety {
  name: string | null;
  height: number;
  weight: number;
  isDefault: boolean;
  artSrc: string;
  abilities: Ability[];
  stats: Stat[];
  types: Type[];
}

export interface EvolutionChainLink {
  isBaby: boolean;
  species: PokemonSpeciesSimple;
  evolvesTo: EvolutionChainLink[];
}

export type PokemonGender = "male" | "female" | "both" | "unknown";

export interface PokemonSpeciesDetailed {
  id: number;
  name: string;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  gender: PokemonGender;
  varieties: PokemonVariety[];
  evolutionChain: EvolutionChainLink;
}
