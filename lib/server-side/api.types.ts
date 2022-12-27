export type ApiOptional<T> = T | null;

export interface ApiNamed {
  name: string;
}

export type ApiResource = string;

export interface ApiNamedResource extends ApiNamed {
  url: ApiResource;
}

export interface ApiPagination {
  count: number;
  next: ApiOptional<ApiResource>;
  previous: ApiOptional<ApiResource>;
}

export interface ApiNamedResourceList extends ApiPagination {
  results: ApiNamedResource[];
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

export interface ApiPokemon extends ApiNamed {
  id: number;
  sprites: ApiPokemonSprites;
  species: ApiNamedResource;
}

export type ApiLanguage = ApiNamed;

export interface ApiName {
  name: string;
  language: ApiLanguage;
}

export interface ApiPokemonSpecies extends ApiNamed {
  names: ApiName[];
}

export interface PokemonSimple {
  id: number;
  artSrc: string;
  name: string;
}
