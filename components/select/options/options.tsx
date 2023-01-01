import { animated, useTransition } from "@react-spring/web";
import { twMerge } from "tailwind-merge";
import { useSelect } from "../context";
import { SelectPopupState } from "../context.types";
import { SelectOptionsProps } from "./options.types";

export default function Options({
  children,
  className,
  ...other
}: SelectOptionsProps) {
  const [{ buttonRef, popupState }] = useSelect();

  const transition = useTransition(popupState !== SelectPopupState.Closed, {
    config: { duration: 80 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transition(
    (styles, open) =>
      open && (
        <animated.ul
          {...other}
          className={twMerge(
            "absolute z-20 w-full shadow-md rounded-lg bg-white py-1.5 flex flex-col",
            className
          )}
          style={{
            top: buttonRef?.current?.getBoundingClientRect().height! + 4,
            ...styles,
          }}
        >
          {children}
        </animated.ul>
      )
  );
}
