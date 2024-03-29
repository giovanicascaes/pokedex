import { DetailedHTMLProps, HTMLAttributes } from "react"

export type BadgeVariant = "default" | "rounded"

export type BadgeColors =
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "orange"
  | "pink"
  | "purple"
  | "cyan"
  | "gray"
  | "white"
  | "black"

export interface BadgeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  color?: BadgeColors
  variant?: BadgeVariant
}
