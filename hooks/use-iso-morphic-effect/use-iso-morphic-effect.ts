import { useEffect, useLayoutEffect } from "react"
import { env } from "utils"
import { UseIsoMorphicEffectFn } from "./use-iso-morphic-effect.types"

const effectFn: UseIsoMorphicEffectFn = env.isServer
  ? useEffect
  : useLayoutEffect

export default effectFn
