import { animated, easings, useTransition } from "@react-spring/web";
import { AnimateOnChangeProps } from "./animtate-on-change.types";

const DEFAULT_DURATION = 700;

export default function AnimateOnChange({
  animationKey,
  transitionDuration = DEFAULT_DURATION,
  ...other
}: AnimateOnChangeProps) {
  const transition = useTransition(animationKey, {
    key: animationKey,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: {
      duration: transitionDuration,
      easing: easings.easeInOutSine,
    },
    exitBeforeEnter: true,
  });

  return transition((style) => (
    <animated.div {...other} style={{ ...style }} />
  ));
}
