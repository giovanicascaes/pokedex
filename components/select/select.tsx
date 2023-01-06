import {
  SelectActions,
  SelectActionTypes,
  SelectContext,
  SelectContextActions,
  SelectContextData,
  SelectPopupState,
  SelectState,
} from "contexts";
import { useOnClickOutside } from "hooks";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { SelectButton } from "./button";
import { SelectOption } from "./option";
import { SelectOptions } from "./options";
import { SelectProps } from "./select.types";

const reducers: {
  [P in SelectActionTypes]: (
    state: SelectState,
    action: Extract<SelectActions, { type: P }>
  ) => SelectState;
} = {
  [SelectActionTypes.RegisterButton](state, action) {
    return { ...state, buttonRef: action.button };
  },
  [SelectActionTypes.RegisterOption](state, action) {
    return {
      ...state,
      optionRefs: [
        ...state.optionRefs,
        {
          ...action.option,
        },
      ],
    };
  },
  [SelectActionTypes.UnregisterOption](state, action) {
    return {
      ...state,
      optionRefs: state.optionRefs.filter((option) => option.id !== action.id),
    };
  },
  [SelectActionTypes.OpenPopup](state) {
    return {
      ...state,
      popupState: SelectPopupState.Open,
      clickedOption: null,
    };
  },
  [SelectActionTypes.ClosePopup](state) {
    return {
      ...state,
      popupState: SelectPopupState.Closed,
    };
  },
  [SelectActionTypes.SelectOption](state, action) {
    return {
      ...state,
      clickedOption: action.id,
      popupState: SelectPopupState.Closing,
    };
  },
};

export function matchReducer(
  state: SelectState,
  action: SelectActions
): SelectState {
  const reducer = reducers as Record<
    SelectActionTypes,
    (state: SelectState, action: SelectActions) => SelectState
  >;
  return reducer[action.type](state, action);
}

const INITIAL_STATE: SelectState = {
  popupState: SelectPopupState.Closed,
  buttonRef: null,
  optionRefs: [],
  clickedOption: null,
};

function Select({
  children,
  onChange,
  defaultValue,
  value = defaultValue,
  disabled = false,
  by = (a: any, b: any) => a === b,
  className,
  ...other
}: SelectProps) {
  const [state, dispatch] = useReducer(matchReducer, INITIAL_STATE);
  const ref = useRef<HTMLDivElement | null>(null);

  const compareValue = useCallback(
    (a: any, b: any) => (typeof by === "string" ? a[by] === b[by] : by(a, b)),
    [by]
  );

  const isSelected = useCallback(
    (toCompare: any) => compareValue(value, toCompare),
    [compareValue, value]
  );

  const data: SelectContextData = useMemo(
    () => ({ ...state, value, disabled, isSelected }),
    [disabled, isSelected, state, value]
  );

  const actions: SelectContextActions = useMemo(
    () => ({
      registerOption(option) {
        dispatch({
          type: SelectActionTypes.RegisterOption,
          option,
        });
        return () =>
          dispatch({
            type: SelectActionTypes.UnregisterOption,
            id: option.id,
          });
      },
      registerButton(button: RefObject<Element>) {
        dispatch({
          type: SelectActionTypes.RegisterButton,
          button,
        });
      },
      openPopup() {
        dispatch({ type: SelectActionTypes.OpenPopup });
      },
      closePopup() {
        dispatch({ type: SelectActionTypes.ClosePopup });
      },
      selectOption(id: string) {
        dispatch({ type: SelectActionTypes.SelectOption, id });
      },
    }),
    []
  );

  useEffect(() => {
    if (data.popupState === SelectPopupState.Closed) {
      const option = data.optionRefs.find(
        (optionRef) => optionRef.id === data.clickedOption
      );

      if (!option) return;

      onChange(option.value);
    }
  }, [data.clickedOption, data.optionRefs, data.popupState, onChange]);

  useOnClickOutside(ref, actions.closePopup);

  return (
    <SelectContext.Provider value={[data, actions]}>
      <div {...other} className={twMerge("w-full", className)} ref={ref}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export default Object.assign(Select, {
  Button: SelectButton,
  Options: SelectOptions,
  Option: SelectOption,
});
