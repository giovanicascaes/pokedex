import { Controller, easings } from "@react-spring/web"
import { PokemonSpeciesPokedex } from "contexts"
import {
  PokemonListItemAnimationProperties,
  PokemonListItemAnimationRunToken,
} from "./pokemon-list.types"

const DEFAULT_ANIMATION_CONFIG = {
  mass: 5,
  tension: 500,
  friction: 100,
  easing: easings.easeOutCirc,
}

class PokemonListItemAnimation {
  private readonly _pokemon: PokemonSpeciesPokedex
  private readonly _properties: PokemonListItemAnimationProperties
  private readonly animation: Controller
  private readonly runToken: PokemonListItemAnimationRunToken
  private _isRunning: boolean = false
  private _isIdle: boolean = false

  constructor(
    pokemon: PokemonSpeciesPokedex,
    properties: PokemonListItemAnimationProperties
  ) {
    this._pokemon = pokemon
    this._properties = properties

    const {
      duration,
      trail,
      values: { from },
    } = this._properties

    this.animation = new Controller({
      config: {
        ...DEFAULT_ANIMATION_CONFIG,
        duration,
      },
      from,
      trail,
      onRest: () => {
        this.finish()
      },
    })
    this.runToken = {}
  }

  async start(noDelay: boolean = false) {
    if (this._isRunning || this._isIdle) return

    return new Promise<void>((resolve) => {
      this._isRunning = true
      this.runToken.cancel = resolve

      const {
        trail,
        values: { to },
      } = this._properties

      this.animation.start({
        to,
        delay: noDelay ? 0 : trail,
        onStart: () => {
          resolve()
        },
      })
    })
  }

  async leave() {
    return new Promise<void>((resolve) => {
      const {
        values: { leave: to },
      } = this._properties

      this.animation.start({
        to,
        onRest: () => {
          resolve()
        },
      })
    })
  }

  skip() {
    this.runToken.cancel?.()
    this.animation.set(this._properties.values.to)
    this.finish()
  }

  finish() {
    this._isIdle = true
    this._isRunning = false
    delete this.runToken.cancel
  }

  cancel() {
    this.animation.stop(true)
  }

  get isIdle() {
    return this._isIdle
  }

  get isRunning() {
    return this._isRunning
  }

  get pokemon() {
    return this._pokemon
  }

  get styles() {
    return this.animation.springs
  }
}

export default class PokemonListItemAnimationController {
  private readonly _properties: PokemonListItemAnimationProperties
  private indexes = new Map<number, PokemonListItemAnimation>()
  private _queue: number[] = []
  private _isAnimating: boolean = false

  constructor(properties: PokemonListItemAnimationProperties) {
    this._properties = properties
  }

  setPokemons(pokemons: PokemonSpeciesPokedex[]) {
    pokemons.forEach((pokemon) => {
      if (!this.indexes.has(pokemon.id)) {
        this.indexes.set(
          pokemon.id,
          new PokemonListItemAnimation(pokemon, this._properties)
        )
      }
    })
  }

  queue(id: number) {
    this._queue.push(id)
    this.start()
  }

  skip(id: number) {
    this.get(id)?.skip()
  }

  skipAll() {
    Array.from(this.indexes.keys()).forEach(this.skip.bind(this))
  }

  start() {
    if (this._isAnimating) return

    this._isAnimating = true
    this.startNext(true)
  }

  async leave(id: number) {
    await this.get(id)?.leave()
  }

  cancel() {
    Array.from(this.indexes.values()).forEach((animation) => {
      if (animation.isRunning) {
        animation.cancel()
      }
    })
  }

  isIdle(id: number) {
    return this.get(id)?.isIdle
  }

  getStyles(id: number) {
    return this.get(id)?.styles
  }

  private async startNext(noDelay: boolean = false) {
    const next = this._queue.shift()

    if (next) {
      const animation = this.get(next)!

      if (!animation.isIdle) {
        await animation.start(noDelay)
        this.skipPrevious(next)
      }

      this.startNext()
    } else {
      this._isAnimating = false
    }
  }

  private skipPrevious(current: number) {
    const indexesAsList = Array.from(this.indexes)
    const currentIndex = indexesAsList.findIndex(([id]) => id === current)

    indexesAsList.slice(0, currentIndex).forEach(([, animation]) => {
      if (!animation.isIdle) {
        animation.skip()
      }
    })
  }

  private get(id: number) {
    return this.indexes.get(id)
  }

  get isAnimating() {
    return this._isAnimating
  }
}
