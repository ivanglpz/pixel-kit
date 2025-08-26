import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import {
  Blend,
  LineSquiggle,
  Scaling,
  Scan,
  Square,
  SquareDashed,
  TriangleRight,
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
  rotate: <TriangleRight size={14} />,
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
          padding: "sm",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border.muted", // ← usa el semantic token
          gap: "md",
          display: "grid",
          gridTemplateColumns: "20px 1fr",
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          height: 30,
        })}
      >
        <div
          className={css({
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "gray.500",
            borderRadius: "4px",
          })}
        >
          {typeof typeIcon[iconType] === "string" ? (
            <p
              className={css({
                fontWeight: 600,
                fontSize: "x-small",
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
              backgroundColor: "transparent",
              flex: 1,
              outline: "none",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis", // Añade los puntos suspensivos
              width: "100%",
              padding: "0 4px",
              fontSize: "x-small",
            })}
          />
        ) : (
          <p
            className={css({
              color: "text",
              backgroundColor: "transparent",
              fontSize: "x-small",
              paddingTop: "3",
            })}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
};
