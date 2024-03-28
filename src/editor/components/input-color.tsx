import { css } from "@stylespixelkit/css";
import { FC } from "react";

type Props = {
  keyInput: string;
  color: string | undefined;
  onChangeColor: (value: string) => void;
  labelText: string;
  primaryColors?: boolean;
};

const PixelKitInputColor: FC<Props> = ({
  color,
  onChangeColor,
  keyInput,
  labelText,
  primaryColors = false,
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
          fontSize: "sm",
        })}
      >
        {labelText}
      </p>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "lg",
          height: "100%",
        })}
      >
        <label
          htmlFor={keyInput}
          className={css({
            height: "30px",
            width: "30px",
            borderRadius: "md",
            border: "container",
            display: "flex",
            padding: "sm",
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
        </label>
        <input
          type="text"
          value={`#${color?.replace(/#/, "") ?? "ffffff"}`}
          className={css({
            width: "10",
            flex: 1,
            border: "container",
            backgroundColor: "transparent",
            color: "text",
            padding: "sm",
            height: "30px",
            borderRadius: "md",
            fontSize: "sm",
          })}
        />
      </div>
      {primaryColors ? (
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "sm",
          })}
        >
          {[
            "#FF0000",
            "#FFFF00",
            "#0000FF",
            "#00FF00",
            "#FF6600",
            "#6600FF",
            "#000000",
            "#FFFFFF",
          ].map((e) => (
            <button
              key={e}
              className={css({
                height: "30px",
                width: "30px",
                borderRadius: "md",
                border: "container",
                display: "flex",
                padding: "sm",
              })}
              style={{
                backgroundColor: e,
              }}
              onClick={() => onChangeColor(e)}
            ></button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PixelKitInputColor;
