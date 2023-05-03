import { uniqueSequential } from "utils"
import {
  AppShellScrollEvent,
  AppShellScrollHistoryEntry,
  AppShellScrollPositionStatus,
} from "./app-shell.types"

const DEFAULT_SCROLL_HISTORY_PATH_VALUE = {
  scrollTop: 0,
  visited: false,
}

export default class ScrollController {
  private readonly _scrollHistory: Map<string, AppShellScrollHistoryEntry> =
    new Map()
  private status: AppShellScrollPositionStatus = "resting"
  private enabled: boolean = true
  private _isSwitchingPage: boolean = false
  private _isLoadingPage: boolean = false
  private _scrollTop: number = 0
  private readonly pageHistory: string[] = []
  private _scrollEl: HTMLElement | null = null
  private readonly scrollListeners: Map<
    AppShellScrollEvent,
    Array<() => void>
  > = new Map([
    ["reset", []],
    ["rest", []],
  ])
  private _currentPath: string
  private _restoreScrollOnNavigatingFrom: string[]

  constructor(currentPath: string, restoreScrollOnNavigatingFrom: string[]) {
    this._currentPath = currentPath
    this._restoreScrollOnNavigatingFrom = restoreScrollOnNavigatingFrom
  }

  scrollTo(top: number) {
    this._scrollEl!.scrollTo({
      top,
    })
    this.onScrollRest()
  }

  scrollToPreviousPosition() {
    this.scrollTo(this.scrollHistory.scrollTop)
  }

  disable() {
    this.enabled = false
  }

  enable() {
    this.enabled = true
  }

  pushHistoryEntry(entry: string) {
    this.pageHistory.push(entry)
  }

  saveCurrentPathState() {
    this._scrollHistory.set(this._currentPath, {
      scrollTop: this._scrollTop,
      visited: true,
    })
  }

  addScrollListener(event: AppShellScrollEvent, cb: () => void) {
    this.scrollListeners.get(event)!.push(cb)
  }

  removeAllListeners() {
    Array.from(this.scrollListeners.keys()).forEach((event) => {
      this.scrollListeners.set(event, [])
    })
  }

  private resetScrollIfNeeded() {
    if (this.enabled && this.shouldResetScroll) {
      this.resetScroll()
    }
  }

  private resetScroll() {
    this._scrollHistory.delete(this._currentPath)
    this.onScrollReset()
  }

  private onScrollRest() {
    this.status = "resting"
    this.consumeListeners("rest")
  }

  private onScrollReset() {
    this.consumeListeners("reset")
  }

  private consumeListeners(event: AppShellScrollEvent) {
    const listeners = this.scrollListeners.get(event)!

    while (listeners.length) {
      const listener = listeners.shift()!

      listener()
    }
  }

  private get isResolving() {
    return this.status === "resolving"
  }

  private get shouldResetScroll() {
    const [prevPath, pathBeforePrevPath] = uniqueSequential(
      [...this.pageHistory].reverse()
    )

    return (
      !this._restoreScrollOnNavigatingFrom.includes(prevPath) ||
      pathBeforePrevPath !== this._currentPath
    )
  }

  get scrollHistory() {
    return (
      this._scrollHistory.get(this._currentPath) ??
      DEFAULT_SCROLL_HISTORY_PATH_VALUE
    )
  }

  get isVisited() {
    return this.scrollHistory.visited
  }

  set scrollEl(scrollEl: HTMLElement) {
    this._scrollEl = scrollEl
  }

  set currentPath(path: string) {
    this._currentPath = path

    this.resetScrollIfNeeded()
  }

  set scrollTop(scrollTop: number) {
    this._scrollTop = scrollTop

    if (this._scrollTop === this.scrollHistory.scrollTop && this.isResolving) {
      this.onScrollRest()
    }
  }

  set isSwitchingPage(isSwitchingPage: boolean) {
    this._isSwitchingPage = isSwitchingPage

    if (this._isSwitchingPage) {
      this.status = "resolving"
    } else if (!this.enabled) {
      this.scrollTo(0)
    } else if (!this._isLoadingPage) {
      this.scrollToPreviousPosition()
    }
  }

  set isLoadingPage(isLoadingPage: boolean) {
    this._isLoadingPage = isLoadingPage

    if (!this._isLoadingPage && !this._isSwitchingPage && this.enabled) {
      this.scrollToPreviousPosition()
    }
  }

  set restoreScrollOnNavigatingFrom(restoreScrollOnNavigatingFrom: string[]) {
    this._restoreScrollOnNavigatingFrom = restoreScrollOnNavigatingFrom
  }
}
