import { uniqueSequential } from "utils"
import {
  AppShellScrollEvent,
  AppShellScrollHistoryEntry,
} from "./app-shell.types"

const DEFAULT_SCROLL_HISTORY_PATH_VALUE = {
  scrollTop: 0,
  visited: false,
}

export default class ScrollController {
  private readonly _scrollHistory: Map<string, AppShellScrollHistoryEntry> =
    new Map()
  private isResolving: boolean = false
  private _isEnabled: boolean = true
  private _isChangingPage: boolean = false
  private _isLoadingPage: boolean = false
  private _scrollTop: number = 0
  private readonly pageHistory: string[] = []
  private _scrollEl: HTMLElement | null = null
  private readonly listeners: Map<AppShellScrollEvent, Array<() => void>> =
    new Map([
      ["scrollResolve", []],
      ["pageLoadComplete", []],
      ["pageTransitionComplete", []],
    ])
  private _currentPath: string
  private _restoreScrollOnNavigatingFrom: string[]

  constructor(currentPath: string, restoreScrollOnNavigatingFrom: string[]) {
    this._currentPath = currentPath
    this._restoreScrollOnNavigatingFrom = restoreScrollOnNavigatingFrom
  }

  *resolve() {
    this.isResolving = true

    if (this._isEnabled) {
      this.isLoadingPage = true
    }

    this.resetScrollIfNeeded()

    yield this.isVisited

    yield new Promise<void>((resolve) => {
      if (!this._isEnabled) {
        resolve()

        return
      }

      const onPageLoadComplete = () => {
        resolve()
      }

      this.addListener("pageLoadComplete", onPageLoadComplete)

      if (!this._isLoadingPage) {
        resolve()
      }
    })

    yield new Promise<void>((resolve) => {
      const onPageTransitionComplete = () => {
        resolve()
      }

      this.addListener("pageTransitionComplete", onPageTransitionComplete)

      if (!this._isChangingPage) {
        resolve()
      }
    })

    if (this._isEnabled) {
      this.scrollToPreviousPosition()
    } else {
      this.scrollTo(0)
    }

    yield new Promise<void>((resolve) => {
      const onScrollRest = () => {
        resolve()
      }

      this.addListener("scrollResolve", onScrollRest)

      if (!this.isResolving) {
        resolve()
      }
    })

    this.onScrollResolved()
    this.removeAllListeners()
  }

  scrollTo(top: number) {
    if (top === this._scrollTop) {
      this.onScrollResolved()
    } else {
      this._scrollEl!.scrollTo({
        top,
      })
    }
  }

  scrollToPreviousPosition() {
    this.scrollTo(this.scrollHistory.scrollTop)
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

  addListener(event: AppShellScrollEvent, cb: () => void) {
    this.listeners.get(event)!.push(cb)
  }

  removeAllListeners() {
    Array.from(this.listeners.keys()).forEach((event) => {
      this.listeners.set(event, [])
    })
  }

  private resetScrollIfNeeded() {
    if (this._isEnabled && this.shouldResetScroll) {
      this.resetScroll()
    }
  }

  private resetScroll() {
    this._scrollHistory.delete(this._currentPath)
  }

  private onScrollResolved() {
    this.isResolving = false
    this.consumeListeners("scrollResolve")
  }

  private consumeListeners(event: AppShellScrollEvent) {
    const listeners = this.listeners.get(event)!

    while (listeners.length) {
      const listener = listeners.shift()!

      listener()
    }
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

  get isChangingPage() {
    return this._isChangingPage
  }

  set isEnabled(enabled: boolean) {
    this._isEnabled = enabled
  }

  set scrollEl(scrollEl: HTMLElement) {
    this._scrollEl = scrollEl
  }

  set currentPath(path: string) {
    this._currentPath = path
  }

  set scrollTop(scrollTop: number) {
    this._scrollTop = scrollTop

    if (this._scrollTop === this.scrollHistory.scrollTop && this.isResolving) {
      this.onScrollResolved()
    }
  }

  set isChangingPage(isChangingPage: boolean) {
    this._isChangingPage = isChangingPage

    if (!this._isChangingPage) {
      this.consumeListeners("pageTransitionComplete")
    }
  }

  set isLoadingPage(isLoadingPage: boolean) {
    this._isLoadingPage = isLoadingPage

    if (!this._isLoadingPage) {
      this.consumeListeners("pageLoadComplete")
    }
  }

  set restoreScrollOnNavigatingFrom(restoreScrollOnNavigatingFrom: string[]) {
    this._restoreScrollOnNavigatingFrom = restoreScrollOnNavigatingFrom
  }
}
