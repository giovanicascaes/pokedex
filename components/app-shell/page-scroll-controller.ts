import { uniqueSequential } from "utils"
import { PageRenderingEvent } from "./app-shell.types"

export default class PageScrollController {
  private readonly _scrollHistory: Map<string, number> = new Map()
  private _isEnabled: boolean = true
  private _isTransitioningPage: boolean = false
  private waitForPageToLoad: boolean = false
  private _scrollTop: number = 0
  private readonly pageHistory: string[] = []
  private _scrollEl: HTMLElement | null = null
  private _currentPath: string = "/"
  private childrenPaths: string[] = []
  private readonly listeners: Map<PageRenderingEvent, Array<() => void>> =
    new Map([
      ["pageLoadComplete", []],
      ["pageTransitionComplete", []],
    ])

  enable({
    childrenPaths,
    waitForPageToLoad,
  }: {
    childrenPaths: string[]
    waitForPageToLoad: boolean
  }) {
    this._isEnabled = true
    this.childrenPaths = childrenPaths
    this.waitForPageToLoad = waitForPageToLoad
  }

  disable() {
    this._isEnabled = false
  }

  async placeScroll() {
    if (this._isEnabled && this.waitForPageToLoad) {
      await new Promise<void>((resolve) => {
        this.addListener("pageLoadComplete", resolve)
      })
    }

    if (this._isTransitioningPage) {
      await new Promise<void>((resolve) => {
        this.addListener("pageTransitionComplete", resolve)
      })
    }

    if (this.shouldRestorePreviousPosition) {
      this.scrollToPreviousPosition()
    } else {
      this.scrollTo(0)
    }
  }

  scrollTo(top: number) {
    if (top !== this._scrollTop) {
      this._scrollEl!.scrollTo({
        top,
      })
    }
  }

  scrollToPreviousPosition() {
    this.scrollTo(this.currentPathScroll)
  }

  pushHistoryEntry(entry: string) {
    this.pageHistory.push(entry)
  }

  saveCurrentPathScroll() {
    this._scrollHistory.set(this._currentPath, this._scrollTop)
  }

  addListener(event: PageRenderingEvent, cb: () => void) {
    this.listeners.get(event)!.push(cb)
  }

  removeAllListeners() {
    Array.from(this.listeners.keys()).forEach((event) => {
      this.listeners.set(event, [])
    })
  }

  onPageLoadComplete() {
    this.consumeListeners("pageLoadComplete")
  }

  private consumeListeners(event: PageRenderingEvent) {
    const listeners = this.listeners.get(event)!

    while (listeners.length) {
      const listener = listeners.shift()!

      listener()
    }
  }

  get currentPathScroll() {
    return this._scrollHistory.get(this._currentPath) ?? 0
  }

  get shouldRestorePreviousPosition() {
    if (!this._isEnabled) return false

    const prevPaths = uniqueSequential(this.pageHistory)
    const lastIndexOfCurrentPath = prevPaths.lastIndexOf(this._currentPath)

    if (lastIndexOfCurrentPath === -1) return false

    const visitedPathsSinceLastAccess = prevPaths.slice(
      lastIndexOfCurrentPath + 1
    )

    return visitedPathsSinceLastAccess.every((path) =>
      this.childrenPaths.includes(path)
    )
  }

  get isTransitioningPage() {
    return this._isTransitioningPage
  }

  set scrollEl(scrollEl: HTMLElement) {
    this._scrollEl = scrollEl
  }

  set currentPath(path: string) {
    this._currentPath = path
  }

  set scrollTop(scrollTop: number) {
    this._scrollTop = scrollTop
  }

  set isTransitioningPage(isTransitioningPage: boolean) {
    this._isTransitioningPage = isTransitioningPage

    if (!this._isTransitioningPage) {
      this.consumeListeners("pageTransitionComplete")
    }
  }
}
