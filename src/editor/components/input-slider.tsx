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
      <div
        className={css({
          width: "100%",
          flex: 1,
          color: "text",
          fontSize: "sm",
          backgroundColor: "bg.muted", // Fondo más claro para el selector
          borderRadius: "md",
          padding: "md",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border.muted", // ← usa el semantic token
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <select
          value={value}
          className={css({
            width: "100%",
            flex: 1,
            color: "text",
            fontSize: "sm",
            backgroundColor: "transparent",
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
    </div>
  );
};
