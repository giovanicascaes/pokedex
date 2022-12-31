import { animated, useSpring } from "@react-spring/web";
import { useEffect, useId, useRef, useState } from "react";
import { MdDone } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { setTimeout } from "timers";
import { useSelect } from "../context";
import { SelectPopupState } from "../context.types";
import { SelectOptionProps } from "./option.types";

const SELECTED_COLOR = "rgba(254, 242, 242, 1)";

const TRANSPARENT_COLOR = "rgba(254, 242, 242, 0)";

export default function Option({
  children,
  value,
  disabled = false,
  className,
  ...other
}: SelectOptionProps) {
  const [
    { isSelected, popupState, clickedOption },
    { registerOption, selectOption, closePopup },
  ] = useSelect();
  const ref = useRef<HTMLLIElement | null>(null);
  const id = useId();
  const [blink, setBlink] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    registerOption({
      id,
      value,
      ref,
    });
  }, [children, id, registerOption, value]);

  const selected =
    clickedOption !== null ? clickedOption === id : isSelected(value);

  const styles = useSpring({
    config: { duration: 45 },
    to: {
      backgroundColor: blink ? TRANSPARENT_COLOR : SELECTED_COLOR,
    },
    onRest: () => {
      setBlink(false);
      setTimeout(closePopup, 200);
    },
  });

  return (
    <animated.li
      {...other}
      onClick={() => {
        if (!disabled) {
          selectOption(id);
          setClicked(true);
          setBlink(true);
        }
      }}
      className={twMerge(
        className,
        "w-full pl-11 pr-3 py-2 text-start text-sm text-slate-800 hover:bg-red-50 hover:text-red-800 flex items-center select-none cursor-pointer",
        popupState !== SelectPopupState.Open && "pointer-events-none",
        selected && "font-medium",
        disabled &&
          "cursor-default text-slate-800/50 hover:bg-transparent pointer-events-none"
      )}
      style={{
        ...(clicked && styles),
      }}
      ref={ref}
    >
      {selected && (
        <MdDone className="fill-red-600 absolute left-3" size={22} />
      )}
      {children}
    </animated.li>
  );
}
