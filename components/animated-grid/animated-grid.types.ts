import { ReactElement } from "react"
import { WithRequired } from "types"

type AnimatedGridItemId = number

export interface AnimatedGridItem {
  id: AnimatedGridItemId
}

export interface AnimatedGridChildrenFnProps<T> {
  item: T
  hide: (id: AnimatedGridItemId) => Promise<void>
}

interface AnimatedGridItemAnimationValuesLookup<T = any> {
  [key: string]: T
}

export type AnimatedGridItemAnimationValues = Record<
  "from" | "enter" | "leave",
  AnimatedGridItemAnimationValuesLookup
>

export interface AnimatedGridItemAnimationConfig
  extends AnimatedGridItemAnimationValues {
  trail: number
  duration: number
}

export interface AnimatedGridColumnConfig {
  gapX?: number
  gapY?: number
  fillColumnWidth?: boolean
  animationConfig?: AnimatedGridItemAnimationConfig
}

export interface AnimatedGridProps<T> {
  items?: T[]
  columns?: number
  columnsConfig?: Record<number, AnimatedGridColumnConfig>
  itemTransitionDuration?: number
  skipFirstItemsAnimation?: boolean
  onLoad?: () => void
  children: (props: AnimatedGridChildrenFnProps<T>) => ReactElement
}

export interface AnimatedGridContainerData {
  gridWidth: number
  gridHeight: number
  gridItemWidth: number
}

export interface AnimatedGridItemStyle {
  x: number
  y: number
}

export type AnimatedGridItemData<T> = T & AnimatedGridItemStyle

export type AnimatedGridData<T> = readonly [
  AnimatedGridContainerData,
  Array<AnimatedGridItemData<T>>
]

export interface AnimatedGridItemAnimationRunToken {
  cancel?: () => void
}

export type UseAnimatedGridArgs<T> = Pick<
  AnimatedGridProps<T>,
  "items" | "skipFirstItemsAnimation" | "onLoad"
> &
  WithRequired<AnimatedGridColumnConfig, "animationConfig">
