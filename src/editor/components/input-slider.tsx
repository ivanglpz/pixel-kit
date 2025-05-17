import { css } from "@stylespixelkit/css";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelText: string;
};

export const InputSlider = ({ onChange, value, labelText }: Props) => {
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
          fontSize: "x-small",
        })}
      >
        {labelText}
      </p>
      <select
        value={value}
        className={css({
          width: "100%",
          flex: 1,
          border: "container",
          backgroundColor: "primary",
          color: "text",
          padding: "md",
          borderRadius: "md",
          fontSize: "sm",
        })}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]?.map((e) => (
          <option key={`selector-slider-${e}`} value={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
};
