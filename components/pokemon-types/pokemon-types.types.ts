import { Type, TypeRelation } from "lib";

export interface PokemonTypesProps {
  types: Type[];
}

export type PokemonTypesDamageRelation = "from" | "to";

export interface PokemonTypesTypeListProps {
  types: Type[];
}

export interface PokemonTypesTypeRelationListProps {
  types: TypeRelation[];
  isDouble?: boolean;
}
