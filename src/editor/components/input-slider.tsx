import { css } from "@stylespixelkit/css";
import { tokens } from "../tokens";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export const InputSlider = ({ onChange, value }: Props) => {
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={css({
        accentColor: tokens.colors.blue,
        width: "100%",
      })}
    />
  );
};
