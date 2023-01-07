import { animated, easings, useTransition } from "@react-spring/web";
import { FadeOnChangeProps } from "./fade-on-change.types";

const DEFAULT_DURATION = 500;

export default function FadeOnChange<T>({
  watchChangesOn,
  children,
  transitionDuration = DEFAULT_DURATION,
  ...other
}: FadeOnChangeProps<T>) {
  const transition = useTransition(watchChangesOn, {
    key: watchChangesOn,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {
      duration: transitionDuration,
      easing: easings.linear,
    },
    exitBeforeEnter: true,
  });

  return transition((style, key) => (
    <animated.div {...other} style={{ ...style }}>
      {typeof children === "function" ? children(key) : children}
    </animated.div>
  ));
}
