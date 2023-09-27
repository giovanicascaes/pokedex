import { Controller, easings } from "@react-spring/web"
import {
  AnimatedGridItem,
  GridTrailItemAnimationConfig,
  GridTrailItemAnimationRunToken,
} from "./animated-grid.types"

const ANIMATION_DURATION = 300

const ANIMATION_TRAIL = 100

class GridTrailItemAnimationController {
  private readonly _config: GridTrailItemAnimationConfig
  private readonly animation: Controller
  private readonly runToken: GridTrailItemAnimationRunToken = {}
  private _isRunning: boolean = false
  private _isDone: boolean = false

  constructor(config: GridTrailItemAnimationConfig) {
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
      onRest: () => {
        this.finish()
      },
    })
  }

  async enter(noDelay: boolean = false) {
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

  async leave() {
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

export default class GridTrailAnimationController {
  private readonly _config: GridTrailItemAnimationConfig
  private animations = new Map<number, GridTrailItemAnimationController>()
  private waiting: number[] = []
  private _queue: number[] = []
  private _isAnimating: boolean = false
  private _immediate: boolean = false

  constructor(config: GridTrailItemAnimationConfig) {
    this._config = config
  }

  queue(id: number) {
    this._queue.push(id)

    if (!this._isAnimating) {
      this.start()
    }
  }

  skip(id: number) {
    this.get(id)?.skip()
    this.setAsAnimated(id)
  }

  skipPrevious(from: number) {
    const fromIndex = this.waiting.indexOf(from)

    if (fromIndex < 0) return

    this.waiting.slice(0, fromIndex).forEach((id) => {
      if (!this.isDone(id)) {
        this.skip(id)
      }
    })
  }

  start() {
    this._isAnimating = true
    this.startNext()
  }

  async hide(id: number) {
    await this.get(id)?.leave()
  }

  cancel() {
    this._queue.forEach((id) => {
      const animation = this.get(id)!

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

  private async run(id: number) {
    const animation = this.get(id)!

    await animation.enter(id === this._queue[0])
    this.setAsAnimated(id)
  }

  private async startNext() {
    const next = this._queue.shift()

    if (next) {
      this.skipPrevious(next)
      const animation = this.get(next)!

      if (!animation.isDone) {
        if (this._immediate) {
          this.skip(next)
        } else {
          await this.run(next)
        }
      }

      this.startNext()
    } else {
      this._isAnimating = false
    }
  }

  private get(id: number) {
    return this.animations.get(id)
  }

  private setAsAnimated(id: number) {
    this.waiting.splice(this.waiting.indexOf(id), 1)
  }

  get isAnimating() {
    return this._isAnimating
  }

  set items(items: AnimatedGridItem[]) {
    items.forEach((item) => {
      if (!this.animations.has(item.id)) {
        this.animations.set(
          item.id,
          new GridTrailItemAnimationController(this._config)
        )
        this.waiting.push(item.id)
      }
    })
  }

  set immediate(immediate: boolean) {
    this._immediate = immediate
  }
}
