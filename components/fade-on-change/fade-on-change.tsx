import { animated, easings, useTransition } from "@react-spring/web"
import { FadeOnChangeProps } from "./fade-on-change.types"

const DEFAULT_TRANSITION_DURATION = 200

export default function FadeOnChange<T>({
  watch,
  children,
  transitionDuration = DEFAULT_TRANSITION_DURATION,
  ...other
}: FadeOnChangeProps<T>) {
  const transition = useTransition(watch, {
    key: watch,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: transitionDuration,
      easing: easings.linear,
    },
    exitBeforeEnter: true,
  })

  return transition((style, changed) => (
    <animated.div {...other} style={{ ...style }}>
      {typeof children === "function" ? children(changed) : children}
    </animated.div>
  ))
}
