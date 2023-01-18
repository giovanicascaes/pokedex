import { DetailedHTMLProps, HTMLAttributes } from "react";

import { RefObject } from "react";

export enum SelectActionTypes {
  RegisterButton,
  RegisterOption,
  UnregisterOption,
  OpenPopup,
  ClosePopup,
  SelectOption,
}

export interface SelectOptionRefBag {
  id: string;
  value: any;
  ref: RefObject<Element>;
}

export enum SelectPopupState {
  Open,
  Closing,
  Closed,
}

export interface SelectState {
  buttonRef: RefObject<Element> | null;
  optionRefs: SelectOptionRefBag[];
  popupState: SelectPopupState;
  clickedOption: string | null;
}

export type SelectActions =
  | { type: SelectActionTypes.RegisterButton; button: RefObject<Element> }
  | {
      type: SelectActionTypes.RegisterOption;
      option: SelectOptionRefBag;
    }
  | { type: SelectActionTypes.UnregisterOption; id: string }
  | { type: SelectActionTypes.OpenPopup }
  | { type: SelectActionTypes.ClosePopup }
  | { type: SelectActionTypes.SelectOption; id: string };

export interface SelectContextData extends SelectState {
  value: any;
  disabled?: boolean;
  isSelected: (value: any) => boolean;
}

export interface SelectContextActions {
  registerButton: (button: RefObject<Element>) => void;
  registerOption: (refBag: SelectOptionRefBag) => () => void;
  openPopup: () => void;
  closePopup: () => void;
  selectOption: (id: string) => void;
}

export type SelectContextValue = [SelectContextData, SelectContextActions];

export interface SelectProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "onChange"
  > {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  onChange: (value: any) => void;
  by?: string | ((a: any, b: any) => boolean);
}
