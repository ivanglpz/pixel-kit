import { Valid } from "@/components/valid";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSlider } from "@/editor/components/input-slider";
import { useTool } from "@/editor/hooks";
import { useStartDrawing } from "@/editor/hooks/useStartDrawing";
import { css } from "@stylespixelkit/css";
import { Brush, PenTool, Ruler } from "lucide-react";
import { useState } from "react";
import { InputNumber } from "../components/input-number";

const modes = {
  soft: { lineJoin: "round", lineCap: "round" },
  straight: { lineJoin: "miter", lineCap: "butt" },
  marker: { lineJoin: "bevel", lineCap: "square" },
};

export const Drawing = () => {
  const { isDrawing, tool } = useTool();
  const {
    color,
    handleChangeColor,
    handleThickness,
    thickness,
    handleChangeLine,
    shadowOpacity,
    lineCap,
    lineJoin,
    dash,
    dashEnable,
    handleDash,
    shadowBlur,
    shadowColor,
    shadowEnabled,
    shadowOffsetX,
    shadowOffsetY,
    closed,
  } = useStartDrawing();
  const [drawMode, setDrawMode] = useState<"soft" | "straight" | "marker">(
    "soft"
  );

  const handleModeChange = (mode: "soft" | "straight" | "marker") => {
    setDrawMode(mode);
    const { lineJoin, lineCap } = modes[mode];
    handleChangeLine("lineJoin", lineJoin);
    handleChangeLine("lineCap", lineCap);
  };

  if (!isDrawing && tool !== "LINE") return null;
  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })} `}
    >
      {/* <InputCheckbox
        text="Bucket Fill"
        value={closed ?? false}
        onCheck={(e) => handleChangeLine("closed", e)}
      /> */}
      <PixelKitInputColor
        labelText="Stroke"
        keyInput={`pixel-kit-draw`}
        color={color}
        onChangeColor={(e) => handleChangeColor(e)}
      />
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
        })}
      >
        <InputNumber
          labelText="Weight"
          value={thickness}
          onChange={handleThickness}
        />
        <div
          className={css({
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
          })}
        >
          <button
            onClick={() => handleModeChange("soft")}
            className={css({
              background: drawMode === "soft" ? "bg.muted" : "transparent",
              borderRadius: "6px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Brush size={20} />
          </button>

          <button
            onClick={() => handleModeChange("straight")}
            className={css({
              background: drawMode === "straight" ? "bg.muted" : "transparent",
              borderRadius: "6px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <Ruler size={20} />
          </button>

          <button
            onClick={() => handleModeChange("marker")}
            className={css({
              background: drawMode === "marker" ? "bg.muted" : "transparent",
              borderRadius: "6px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <PenTool size={20} />
          </button>
        </div>
      </div>

      <InputCheckbox
        text="Dash"
        value={dashEnable ?? true}
        onCheck={(e) => handleDash("dashEnable", e)}
      />
      <Valid isValid={dashEnable ?? false}>
        <InputSlider
          labelText={`Array (${dash})`}
          onChange={(e) => handleDash("dash", e)}
          value={dash || 0}
        />
      </Valid>
      <InputCheckbox
        text="Shadow"
        value={shadowEnabled ?? true}
        onCheck={(e) => handleChangeLine("shadowEnabled", e)}
      />
      <Valid isValid={shadowEnabled ?? false}>
        <PixelKitInputColor
          labelText="Color"
          keyInput={`pixel-kit-draw-before-shadowcolor`}
          color={shadowColor}
          onChangeColor={(e) => handleChangeLine("shadowColor", e)}
        />
        <InputSlider
          labelText="X"
          onChange={(e) => handleChangeLine("shadowOffsetX", e)}
          value={shadowOffsetX || 0}
        />

        <InputSlider
          labelText="Y"
          onChange={(e) => handleChangeLine("shadowOffsetY", e)}
          value={shadowOffsetY || 0}
        />

        <InputSlider
          labelText="Blur"
          onChange={(e) => handleChangeLine("shadowBlur", e)}
          value={shadowBlur || 0}
        />

        <InputSlider
          min={0}
          labelText="Opacity"
          max={1}
          step={0.1}
          onChange={(e) => handleChangeLine("shadowOpacity", e)}
          value={shadowOpacity || 0}
        />
      </Valid>
    </div>
  );
};
