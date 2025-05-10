import { Valid } from "@/components/valid";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { Section } from "@/editor/components/section";
import { useTool } from "@/editor/hooks";
import { useBeforeStartDrawing } from "@/editor/states/drawing/useBeforeStartDrawing";
import { css } from "@stylespixelkit/css";

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
  } = useBeforeStartDrawing();
  if (!isDrawing && tool !== "LINE") return null;
  return (
    <Section title={isDrawing ? "Draw" : "Line"}>
      <div
        className={`${css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
          height: "100%",
        })} `}
      >
        <InputCheckbox
          text="Bucket Fill"
          value={closed ?? false}
          onCheck={(e) => handleChangeLine("closed", e)}
        />
        <PixelKitInputColor
          labelText="Color"
          keyInput={`pixel-kit-draw`}
          primaryColors
          color={color}
          onChangeColor={(e) => handleChangeColor(e)}
        />

        <InputSlider
          labelText="Thickness"
          value={thickness}
          onChange={handleThickness}
        />

        <InputSelect
          labelText="Line Join"
          value={lineJoin}
          onChange={(e) => handleChangeLine("lineJoin", e)}
          options={[
            {
              id: `line-join-1-round`,
              label: "Round",
              value: "round",
            },
            {
              id: `line-join-2-bevel`,
              label: "Bevel",
              value: "bevel",
            },
            {
              id: `line-join-3-miter`,
              label: "Miter",
              value: "miter",
            },
          ]}
        />

        <InputSelect
          labelText="Line Cap"
          value={lineCap}
          onChange={(e) => handleChangeLine("lineCap", e)}
          options={[
            {
              id: `line-cap-1-round`,
              label: "Round",
              value: "round",
            },
            {
              id: `line-cap-2-butt`,
              label: "Butt",
              value: "butt",
            },
            {
              id: `line-cap-3-square`,
              label: "Square",
              value: "square",
            },
          ]}
        />
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
    </Section>
  );
};
