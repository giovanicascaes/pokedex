import { getPokemons } from "lib"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    limit,
    offset,
  }: {
    limit?: number
    offset?: number
  } = req.query

  const pokemons = await getPokemons(limit, offset)

  return res.status(200).json({ result: pokemons })
}
