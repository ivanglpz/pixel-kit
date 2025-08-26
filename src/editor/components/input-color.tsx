import { css } from "@stylespixelkit/css";
import { FC } from "react";

type Props = {
  keyInput: string;
  color: string | undefined;
  onChangeColor: (value: string) => void;
  labelText: string;
};

const InputColor: FC<Props> = ({
  color,
  onChangeColor,
  keyInput,
  labelText,
}) => {
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

      <label
        htmlFor={keyInput}
        className={css({
          width: "100%",
          color: "text",
          fontSize: "sm",
          backgroundColor: "bg.muted", // Fondo más claro para el selector
          borderRadius: "md",
          padding: "sm",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border.muted", // ← usa el semantic token
          gap: "md",
          display: "grid",
          gridTemplateColumns: "20px 1fr",
          alignItems: "center",
          height: 30,
        })}
      >
        <div
          className={css({
            height: "20px",
            width: "20px",
            borderRadius: "md",
            border: "container",
            display: "flex",
            padding: "sm",
            cursor: "pointer",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border.muted", // ← usa el semantic token
            alignItems: "center",
            justifyContent: "center",
          })}
          style={{
            backgroundColor: color ?? "#ffffff",
          }}
        >
          <input
            type="color"
            id={keyInput}
            className={css({
              margin: 0,
              outline: "none",
              padding: 0,
              border: "none",
              opacity: 0,
              height: 0,
              width: 0,
            })}
            value={color}
            onChange={(event) => onChangeColor(event.target.value)}
          />
        </div>
        <label
          htmlFor={keyInput}
          className={css({
            backgroundColor: "transparent",
            color: "text",
            height: "20px",
            fontSize: "sm",
            border: "none",
          })}
        >
          #{color?.replace(/#/, "") ?? "ffffff"}
        </label>
      </label>
    </div>
  );
};

export default InputColor;
