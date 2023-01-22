import { animated, easings, useTransition } from "@react-spring/web";
import { TransitionLayoutProps } from "./transition-layout.types";

const TRANSITION_DURATION = 150;

export default function TransitionLayout({
  children,
  onTransitionRest,
  ...other
}: TransitionLayoutProps) {
  const transition = useTransition(children, {
    key: children,
    config: {
      easing: easings.linear,
      duration: TRANSITION_DURATION,
    },
    from: {
      transform: "translateY(-30px)",
      opacity: 0,
    },
    enter: {
      transform: "translateY(0px)",
      opacity: 1,
    },
    leave: {
      transform: "translateY(30px)",
      opacity: 0,
    },
    onRest() {
      onTransitionRest();
    },
    exitBeforeEnter: true,
  });

  return (
    <>
      {transition((styles, render) => (
        <animated.div
          {...other}
          className="overflow-hidden h-full"
          style={{ ...styles }}
        >
          {render}
        </animated.div>
      ))}
    </>
  );
}
