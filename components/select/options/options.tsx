import { animated, useTransition } from "@react-spring/web";
import { SelectPopupState, useSelect } from "contexts";
import { twMerge } from "tailwind-merge";
import { SelectOptionsProps } from "./options.types";

export default function Options({
  children,
  className,
  ...other
}: SelectOptionsProps) {
  const [{ popupState }] = useSelect();

  const isOpen = popupState !== SelectPopupState.Closed;

  const transition = useTransition(isOpen, {
    config: { duration: 80 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  if (typeof children === "function") return <>{children({ open: isOpen })}</>;

  return transition(
    (styles, open) =>
      open && (
        <animated.ul
          {...other}
          className={twMerge(
            "absolute z-10 w-full shadow-md rounded-lg bg-white dark:bg-slate-700 py-1.5 flex flex-col top-[calc(100%+4px)]",
            className
          )}
          style={{
            ...styles,
          }}
        >
          {children}
        </animated.ul>
      )
  );
}
