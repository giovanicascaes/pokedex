import { Controller, easings } from "@react-spring/web"
import {
  AnimatedGridItem,
  ItemAnimationRunToken,
  GridItemsAnimationConfig as ItemsAnimationConfig,
} from "./animated-grid.types"

const ANIMATION_DURATION = 300

const ANIMATION_TRAIL = 100

class ItemAnimation {
  private readonly _config: ItemsAnimationConfig
  private readonly animation: Controller
  private readonly runToken: ItemAnimationRunToken
  private _isRunning: boolean = false
  private _isDone: boolean = false

  constructor(config: ItemsAnimationConfig) {
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

export default class ItemsAnimationController {
  private readonly _config: ItemsAnimationConfig
  private animations = new Map<number, ItemAnimation>()
  private waitingItems: number[] = []
  private animatingItems: number[] = []
  private _isAnimating: boolean = false
  private _immediate: boolean = false
  private onExhaustQueueListener?: () => void

  constructor(config: ItemsAnimationConfig, onExhaustQueue?: () => void) {
    this._config = config
    this.onExhaustQueueListener = onExhaustQueue
  }

  setItems(items: AnimatedGridItem[]) {
    items.forEach((item) => {
      if (!this.animations.has(item.id)) {
        this.animations.set(item.id, new ItemAnimation(this._config))
        this.waitingItems.push(item.id)
      }
    })
  }

  queue(id: number) {
    console.log(
      "🚀 ~ file: items-animation-controller.ts:126 ~ ItemsAnimationController ~ queue ~ id:",
      id
    )
    this.animatingItems.push(id)
    this.start()
  }

  skip(id: number) {
    this.get(id)?.skip()
    this.markAsAnimated(id)
  }

  skipPrevious(from: number) {
    const currentIndex = this.waitingItems.findIndex((id) => id === from)

    this.waitingItems.slice(0, currentIndex).forEach((id) => {
      if (!this.isDone(id)) {
        this.skip(id)
      }
    })
  }

  start() {
    if (this._isAnimating) return

    this._isAnimating = true
    this.startNext()
  }

  async hideItem(id: number) {
    await this.get(id)?.hide()
  }

  cancel() {
    this.waitingItems.forEach((id) => {
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

    await animation.start(id === this.animatingItems[0])
    this.markAsAnimated(id)
  }

  private async startNext() {
    const next = this.animatingItems.shift()

    if (next) {
      const animation = this.get(next)!

      if (!animation.isDone) {
        if (this._immediate) {
          this.skip(next)
        } else {
          await this.run(next)
        }

        this.skipPrevious(next)
      }

      this.startNext()
    } else {
      this._isAnimating = false
    }
  }

  private get(id: number) {
    return this.animations.get(id)
  }

  private markAsAnimated(id: number) {
    this.waitingItems.splice(id)

    if (!this.animatingItems.length) {
      this.onExhaustQueueListener?.()
    }
  }

  get isAnimating() {
    return this._isAnimating
  }

  set immediate(immediate: boolean) {
    this._immediate = immediate
  }
}
