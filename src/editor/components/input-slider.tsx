import { css } from "@stylespixelkit/css";
import { tokens } from "../tokens";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelText: string;
};

export const InputSlider = ({
  onChange,
  value,
  min,
  max,
  step,
  labelText,
}: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })}
    >
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        {labelText}
      </p>
      <input
        type="range"
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={css({
          accentColor: "secondary",
          width: "100%",
          height: "4px",
          cursor: "pointer",
        })}
      />
    </div>
  );
};
