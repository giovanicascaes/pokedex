import { Ability } from "lib";
import { DetailedHTMLProps, HTMLAttributes, Ref } from "react";

export interface AbilityOverlayProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "ref"
  > {
  // `react-spring`'s `animated` api doesn't support legacy ref api (`string` type)
  ref?: Ref<HTMLDivElement>;
  ability?: Ability;
  onClose: () => void;
}
