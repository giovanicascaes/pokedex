import { useEffect, useRef } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { twJoin, twMerge } from "tailwind-merge";
import { useSelect } from "../context";
import { SelectPopupState } from "../context.types";
import { SelectButtonProps } from "./button.types";

export default function Button({
  children,
  className,
  ...other
}: SelectButtonProps) {
  const [{ popupState }, { openPopup, closePopup, registerButton }] =
    useSelect();
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerButton(ref);
  }, [registerButton]);

  return (
    <button
      {...other}
      onClick={() => {
        if (popupState === SelectPopupState.Open) {
          closePopup();
        } else if (popupState === SelectPopupState.Closed) {
          openPopup();
        }
      }}
      className={twMerge(
        className,
        "w-full pl-3 pr-2 py-2 shadow-md rounded-lg text-start text-sm bg-white text-slate-800 hover:bg-gray-50/5 active:bg-gray-100/30 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50"
      )}
      ref={ref}
    >
      {children}
      <div className="ml-auto pointer-events-none">
        <MdExpandMore
          className={twMerge(
            "fill-slate-400 transform rotate-180 transition-transform",
            popupState === SelectPopupState.Closed && "rotate-0"
          )}
          size={22}
        />
      </div>
    </button>
  );
}
