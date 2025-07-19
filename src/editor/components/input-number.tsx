import { css } from "@stylespixelkit/css";
import { LineSquiggle } from "lucide-react";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelText: string;
};

export const InputNumber = ({
  onChange,
  value,
  min = 1,
  max = 100,
  step = 1,
  labelText,
}: Props) => {
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

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
          gap: "md",
        })}
      >
        <LineSquiggle size={17} />
        {/* Input number */}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleNumberChange}
          className={css({
            color: "text",
            fontSize: "sm",
            backgroundColor: "transparent",
            flex: 1,
            outline: "none",
          })}
        />
      </div>
    </div>
  );
};
