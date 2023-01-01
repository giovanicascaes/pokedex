import { useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { useSelect } from "../context";
import { SelectPopupState } from "../context.types";
import { SelectButtonProps } from "./button.types";

export default function Button({
  children,
  className,
  ...other
}: SelectButtonProps) {
  const [{ popupState, disabled }, { openPopup, closePopup, registerButton }] =
    useSelect();
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerButton(ref);
  }, [registerButton]);

  return (
    <button
      {...other}
      disabled={disabled}
      onClick={() => {
        if (popupState === SelectPopupState.Open) {
          closePopup();
        } else if (popupState === SelectPopupState.Closed) {
          openPopup();
        }
      }}
      className={twMerge(
        "w-full pl-3 pr-2 py-2 shadow-md rounded-lg text-start text-sm bg-white text-slate-700 hover:bg-gray-50/5 hover:text-black active:bg-gray-100/30 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-opacity-50 group",
        disabled &&
          "cursor-default opacity-50 hover:bg-white pointer-events-none",
        className
      )}
      ref={ref}
    >
      {children}
      <div className="ml-auto pointer-events-none">
        <MdExpandMore
          className={twMerge(
            "fill-slate-400 group-hover:fill-slate-500 transform rotate-180 transition-transform",
            popupState === SelectPopupState.Closed && "rotate-0"
          )}
          size={22}
        />
      </div>
    </button>
  );
}
