import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { ButtonProps } from "./button.types";

export default forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, ...other },
  ref
) {
  return (
    <button
      className={twMerge(
        className,
        "px-3 py-2 rounded-md font-medium text-sm select-none text-slate-700 hover:bg-blue-50 hover:text-blue-800 active:bg-blue-100 active:text-blue-900 transition-colors"
      )}
      {...other}
      ref={ref}
    />
  );
});
