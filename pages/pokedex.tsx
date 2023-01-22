import { InferGetStaticPropsType } from "next";

type PokedexProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Pokedex(props: PokedexProps) {
  return <div></div>;
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
