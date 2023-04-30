import { AppScroll } from "components/app-scroll"
import { AppControlledScrollProps } from "./app-controlled-scroll.types"

export default function AppControlledScroll({
  children,
  className,
  ...other
}: AppControlledScrollProps) {
  return <AppScroll {...other}>{children}</AppScroll>
}
