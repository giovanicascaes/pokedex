import { animated, easings, useTransition } from "@react-spring/web";
import { Select } from "components";
import { ThemeMode, useThemeMode } from "contexts";
import { useEffect, useState } from "react";
import {
  HiOutlineComputerDesktop,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import { match } from "utils";
import { ThemeSwitcherProps } from "./theme-switcher.types";

const POPUP_TRANSITION_DURATION = 220;

const getThemeModeIcon = (mode: ThemeMode) => {
  const Icon = match(
    {
      [ThemeMode.Dark]: HiOutlineMoon,
      [ThemeMode.Light]: HiOutlineSun,
      [ThemeMode.System]: HiOutlineComputerDesktop,
    },
    mode
  )!;

  return <Icon size={20} />;
};

function OptionsPopup({ open }: { open: boolean }) {
  const transition = useTransition(open, {
    config: {
      tension: 28,
      friction: 0,
      duration: POPUP_TRANSITION_DURATION,
      easing: easings.easeOutBack,
    },
    from: { opacity: 0, scale: "95%" },
    enter: { opacity: 1, scale: "100%" },
    leave: { opacity: 0, scale: "95%" },
  });

  return transition(
    (styles, show) =>
      show && (
        <animated.ul
          className="absolute z-10 w-40 origin-top-right bg-white dark:bg-slate-700 flex flex-col right-6 top-[calc(100%-4px)] py-2.5 rounded-xl ring-1 ring-slate-900/10 dark:ring-slate-600 shadow-lg"
          style={{
            ...styles,
          }}
        >
          {[
            [ThemeMode.Light, "Light"],
            [ThemeMode.Dark, "Dark"],
            [ThemeMode.System, "System"],
          ].map(([theme, name]) => (
            <Select.Option key={theme} value={theme} className="group">
              {({ clicked }) => (
                <span className="flex space-x-2">
                  <span
                    className={twMerge(
                      "text-slate-400 group-hover:text-red-800 dark:text-slate-400 dark:group-hover:text-red-400",
                      clicked && "text-red-800 dark:text-red-400"
                    )}
                  >
                    {getThemeModeIcon(theme as ThemeMode)}
                  </span>
                  <span>{name}</span>
                </span>
              )}
            </Select.Option>
          ))}
        </animated.ul>
      )
  );
}

export default function ThemeSwitcher(props: ThemeSwitcherProps) {
  const [animate, setAnimate] = useState(false);
  const [{ themeMode }, { setThemeMode }] = useThemeMode();

  const transitions = useTransition(themeMode, {
    keys: null,
    from: { opacity: 0, transform: "translate3d(-50%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(100%,0,0)" },
    config: { duration: 150, easing: easings.linear },
    exitBeforeEnter: true,
    immediate: !animate,
  });

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Select
      {...props}
      value={themeMode}
      onChange={setThemeMode}
      className="w-min"
    >
      <Select.Button
        variant="unstyled"
        className="w-8 h-8 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 text-slate-500 dark:text-slate-300 hover:text-black dark:hover:text-white"
      >
        {transitions((styles, theme) => (
          <animated.div style={{ ...styles }}>
            {getThemeModeIcon(theme)}
          </animated.div>
        ))}
      </Select.Button>
      <Select.Options>
        {({ open }) => <OptionsPopup open={open} />}
      </Select.Options>
    </Select>
  );
}
