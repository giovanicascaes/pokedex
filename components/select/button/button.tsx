import { SelectPopupState, useSelect } from "contexts";
import { useEffect, useRef } from "react";
import { MdExpandMore } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { SelectButtonProps } from "./button.types";

export default function Button({
  variant = "default",
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
        variant !== "unstyled" && [
          "w-full pl-3 pr-2 py-2 shadow-md rounded-lg text-start text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/[0.16] active:bg-slate-100 dark:active:bg-white/[0.21] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 group",
          disabled &&
            "cursor-default opacity-50 hover:bg-white dark:hover:bg-slate-700 pointer-events-none",
        ],
        className
      )}
      ref={ref}
    >
      {children}
      {variant !== "unstyled" && (
        <div className="ml-auto pointer-events-none">
          <MdExpandMore
            className={twMerge(
              "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300 transform rotate-180 transition-transform",
              popupState === SelectPopupState.Closed && "rotate-0"
            )}
            size={22}
          />
        </div>
      )}
    </button>
  );
}
