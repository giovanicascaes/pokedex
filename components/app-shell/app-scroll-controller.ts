import { uniqueSequential } from "utils"
import { PageRenderingEvent } from "./app-shell.types"

export default class AppScrollController {
  private readonly _scrollHistory: Map<string, number> = new Map()
  private _isEnabled: boolean = true
  private _isLeavingPage: boolean = false
  private _waitForPageToLoad: boolean = false
  private _scrollTop: number = 0
  private readonly pageHistory: string[] = []
  private _scrollEl: HTMLElement | null = null
  private _currentPath: string = "/"
  private _childrenPaths: string[] = []
  private readonly listeners: Map<PageRenderingEvent, Array<() => void>> =
    new Map([
      ["pageLoadComplete", []],
      ["pageUnmountComplete", []],
    ])

  enable({
    childrenPaths,
    waitForPageToLoad,
  }: {
    childrenPaths: string[]
    waitForPageToLoad: boolean
  }) {
    this._isEnabled = true
    this._childrenPaths = childrenPaths
    this._waitForPageToLoad = waitForPageToLoad
  }

  disable() {
    this._isEnabled = false
  }

  async placeScroll() {
    if (this._isEnabled && this._waitForPageToLoad) {
      await new Promise<void>((resolve) => {
        this.addListener("pageLoadComplete", resolve)
      })
    }

    if (this._isLeavingPage) {
      await new Promise<void>((resolve) => {
        this.addListener("pageUnmountComplete", resolve)
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
      this._childrenPaths.includes(path)
    )
  }

  get isLeavingPage() {
    return this._isLeavingPage
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

  set isLeavingPage(isLeavingPage: boolean) {
    this._isLeavingPage = isLeavingPage

    if (!this._isLeavingPage) {
      this.consumeListeners("pageUnmountComplete")
    }
  }
}
