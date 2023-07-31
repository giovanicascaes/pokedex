import { Controller, easings } from "@react-spring/web"
import {
  AnimatedGridItem,
  AnimatedGridItemAnimationConfig,
  AnimatedGridItemAnimationRunToken,
} from "./animated-grid.types"

const ANIMATION_DURATION = 300

const ANIMATION_TRAIL = 100

class AnimatedGridItemAnimation {
  private readonly _config: AnimatedGridItemAnimationConfig
  private readonly animation: Controller
  private readonly runToken: AnimatedGridItemAnimationRunToken
  private _isRunning: boolean = false
  private _isDone: boolean = false

  constructor(config: AnimatedGridItemAnimationConfig) {
    this._config = config

    const { from } = this._config

    this.animation = new Controller({
      config: {
        duration: ANIMATION_DURATION,
        mass: 5,
        tension: 500,
        friction: 100,
        easing: easings.easeOutCirc,
      },
      from,
      trail: ANIMATION_TRAIL,
      onRest: () => {
        this.finish()
      },
    })
    this.runToken = {}
  }

  async start(noDelay: boolean = false) {
    if (this._isRunning || this._isDone) return

    return new Promise<void>((resolve) => {
      this._isRunning = true
      this.runToken.cancel = resolve

      const { enter: to } = this._config

      this.animation.start({
        to,
        delay: noDelay ? 0 : ANIMATION_TRAIL,
        onStart: () => {
          resolve()
        },
      })
    })
  }

  async hide() {
    return new Promise<void>((resolve) => {
      const { leave: to } = this._config

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
    this.animation.set(this._config.enter)
    this.finish()
  }

  finish() {
    this._isDone = true
    this._isRunning = false
    delete this.runToken.cancel
  }

  cancel() {
    this.animation.stop(true)
  }

  get isDone() {
    return this._isDone
  }

  get isRunning() {
    return this._isRunning
  }

  get styles() {
    return this.animation.springs
  }
}

export default class AnimatedGridItemAnimationController {
  private readonly _config: AnimatedGridItemAnimationConfig
  private indexes = new Map<number, AnimatedGridItemAnimation>()
  private _queue: number[] = []
  private _isAnimating: boolean = false

  constructor(config: AnimatedGridItemAnimationConfig) {
    this._config = config
  }

  setItems(items: AnimatedGridItem[]) {
    items.forEach((item) => {
      if (!this.indexes.has(item.id)) {
        this.indexes.set(item.id, new AnimatedGridItemAnimation(this._config))
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

  async hideItem(id: number) {
    await this.get(id)?.hide()
  }

  cancel() {
    Array.from(this.indexes.values()).forEach((animation) => {
      if (animation.isRunning) {
        animation.cancel()
      }
    })
  }

  isDone(id: number) {
    return this.get(id)?.isDone
  }

  getStyles(id: number) {
    return this.get(id)?.styles
  }

  private async startNext(noDelay: boolean = false) {
    const next = this._queue.shift()

    if (next) {
      const animation = this.get(next)!

      if (!animation.isDone) {
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
      if (!animation.isDone) {
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
