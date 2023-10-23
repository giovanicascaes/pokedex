import { ReactElement } from "react"

export interface AnimatedGridChildrenFnProps<T> {
  item: T
}

interface GridTrailItemAnimationValuesLookup {
  [key: string]: any
}

export type GridTrailItemAnimationConfig = Record<
  "from" | "enter" | "leave",
  GridTrailItemAnimationValuesLookup
>

export interface GridTrailItemAnimationRunToken {
  cancel?: () => void
}

export interface AnimatedGridProps<T> {
  items?: T[]
  columns: number
  itemWidth: number
  itemHeight: number
  gapX?: number
  gapY?: number
  animationConfig?: GridTrailItemAnimationConfig
  immediateAnimations?: boolean
  fillColumnWidth?: boolean
  onLoad?: () => void
  children: (props: AnimatedGridChildrenFnProps<T>) => ReactElement
}

export interface AnimatedGridDimensions {
  width: number
  height: number
  itemWidth: number
}

export interface AnimatedGridItem {
  id: number
}

export interface AnimatedGridItemStyle {
  x: number
  y: number
}

export type AnimatedGridItemData<T> = T & AnimatedGridItemStyle

export type AnimatedGridData<T> = readonly [
  AnimatedGridDimensions,
  Array<AnimatedGridItemData<T>>
]

export interface UseGridItemsAnimationArgs<T>
  extends Required<Pick<AnimatedGridProps<T>, "animationConfig">> {
  items?: Array<AnimatedGridItemData<T>>
  immediate?: boolean
}

export type UseGridItemsAnimationTransitionRenderFn<T> = (
  styles: { [x: string]: any },
  item: AnimatedGridItemData<T>
) => JSX.Element

export interface UseGridAnimationArgs {
  gridWidth: number
  containerWidth: number
  immediate?: boolean
  onInitialPositionSet?: () => void
}

export interface UseGridArgs<T>
  extends Required<
    Pick<
      AnimatedGridProps<T>,
      | "items"
      | "columns"
      | "itemWidth"
      | "itemHeight"
      | "gapX"
      | "gapY"
      | "fillColumnWidth"
    >
  > {
  containerWidth: number
}
