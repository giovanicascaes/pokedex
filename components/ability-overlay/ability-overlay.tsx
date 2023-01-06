import { animated, useTransition } from "@react-spring/web";
import { useScrollTop } from "hooks";
import { MdClose } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { AbilityOverlayProps } from "./ability-overlay-types";

export default function AbilityDescriptionOverlay({
  ability,
  onClose,
  className,
  ...other
}: AbilityOverlayProps) {
  const [scrollTop, { onScroll }] = useScrollTop();

  const transition = useTransition(ability, {
    config: { duration: 150 },
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
  });

  return transition(
    (styles, item) =>
      item && (
        <animated.div
          {...other}
          className="absolute z-10 top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-slate-700/70 dark:bg-slate-600/70 border border-slate-600/70 dark:border-slate-500/40 backdrop-blur-md rounded-md"
          style={{ ...styles }}
        >
          <div className="text-slate-300 dark:text-slate-400 text-sm flex flex-col h-full">
            <span
              className={twMerge(
                "text-2xl text-white dark:text-slate-200 p-3 transition-shadow shadow-none shadow-slate-700/40 dark:shadow-slate-900/40",
                scrollTop > 0 && "shadow"
              )}
            >
              {item?.name}
            </span>
            <button
              onClick={onClose}
              className="absolute z-10 top-3 right-3 text-slate-300 dark:text-slate-300/90 hover:text-slate-200 dark:hover:text-white p-0.5 rounded cursor-pointer bg-slate-600 dark:bg-slate-800/80 hover:bg-slate-700 dark:hover:bg-slate-900/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50"
            >
              <MdClose size={20} />
            </button>
            <span onScroll={onScroll} className="overflow-auto p-4">
              {item?.description}
            </span>
          </div>
        </animated.div>
      )
  );
}
