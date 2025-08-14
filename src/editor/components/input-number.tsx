import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import {
  Blend,
  LineSquiggle,
  Scaling,
  Scan,
  Square,
  SquareDashed,
  X,
} from "lucide-react";
import { HTMLInputTypeAttribute } from "react";
import { PAUSE_MODE_ATOM } from "../states/tool";

const typeIcon = {
  "draw-weight": <LineSquiggle size={14} />,
  x: <X size={14} />,
  y: "Y",
  width: "W",
  height: "H",
  opacity: <Blend size={14} />,
  br: <Scan size={14} />,
  font: <Scaling size={14} />,
  dashed: <SquareDashed size={14} />,
  square: <Square size={14} />,
};
type Props = {
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  labelText?: string;
  iconType: keyof typeof typeIcon;
  type?: HTMLInputTypeAttribute;
};

export const InputNumber = ({
  onChange,
  value,
  min = 1,
  max = Infinity,
  step = 1,
  labelText,
  iconType = "draw-weight",
  type = "number",
}: Props) => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setPause(true);
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
      {labelText?.length ? (
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "x-small",
            height: "15px",
          })}
        >
          {labelText}
        </p>
      ) : null}

      <div
        className={css({
          width: "100%",
          color: "text",
          fontSize: "sm",
          backgroundColor: "bg.muted", // Fondo más claro para el selector
          borderRadius: "md",
          padding: "md",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border.muted", // ← usa el semantic token
          gap: "md",
          display: "grid",
          gridTemplateColumns: "17px 1fr",
          alignItems: "center",
          height: "33.5px",
        })}
      >
        <div
          className={css({
            width: "17px",
            height: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          {}
          {typeof typeIcon[iconType] === "string" ? (
            <p
              className={css({
                fontWeight: 600,
                fontSize: "10px",
              })}
            >
              {typeIcon[iconType]}
            </p>
          ) : (
            typeIcon[iconType]
          )}
        </div>
        {/* Input number */}
        {typeof value === "number" ? (
          <input
            type={type}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleNumberChange}
            onClick={() => setPause(true)}
            onBlur={() => setPause(false)}
            onMouseLeave={() => setPause(false)}
            className={css({
              color: "text",
              fontSize: "sm",
              backgroundColor: "transparent",
              flex: 1,
              outline: "none",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis", // Añade los puntos suspensivos
              width: "100%",
              padding: "0 4px",
            })}
          />
        ) : (
          <p
            className={css({
              color: "text",
              fontSize: "sm",
              backgroundColor: "transparent",
              flex: 1,
            })}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
};
