import { uniqueSequential } from "utils"

type AppShellScrollControllerEvent = "transitionEnd" | "pageLoadEnd"

type AppShellScrollControllerStatus =
  | "idle"
  | "transitionStart"
  | "transitionEnd"
  | "pageLoadEnd"

interface AppShellScrollControllerOnTransitionStartArgs {
  restoreScrollOnNavigatingFrom: string[]
  currentPath: string
  enabled: boolean
}

const DEFAULT_SCROLL_HISTORY_PATH_VALUE = {
  scrollTop: 0,
  visited: false,
}

export default class ScrollController {
  private status: AppShellScrollControllerStatus = "idle"
  private readonly listeners: Map<
    AppShellScrollControllerEvent,
    Array<() => void>
  > = new Map([
    ["transitionEnd", []],
    ["pageLoadEnd", []],
  ])
  private readonly pageHistory: string[] = []

  constructor() {}

  pushHistoryEntry(entry: string) {
    this.pageHistory.push(entry)
  }

  *resolveScroll({
    currentPath,
    enabled,
    restoreScrollOnNavigatingFrom,
  }: AppShellScrollControllerOnTransitionStartArgs) {
      if (enabled && this.shouldResetScroll(restoreScrollOnNavigatingFrom, currentPath)) {
        this._scrollHistory.delete(this.currentPath)
        yield true
      }
  }

  private shouldResetScroll(
    restoreScrollOnNavigatingFrom: string[],
    currentPath: string
  ) {
    const [prevPath, pathBeforePrevPath] = uniqueSequential(
      [...this.pageHistory].reverse()
    )

    return (
      !restoreScrollOnNavigatingFrom.includes(prevPath) ||
      pathBeforePrevPath !== currentPath
    )
  }
}
