import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { useTool } from "@/editor/hooks";
import { useBeforeStartDrawing } from "@/editor/states/drawing/useBeforeStartDrawing";
import { css } from "@stylespixelkit/css";

export const Drawing = () => {
  const { isDrawing } = useTool();
  const {
    color,
    handleChangeColor,
    handleThickness,
    thickness,
    handleChangeLine,
    lineCap,
    lineJoin,
    dash,
    dashEnable,
    handleDash,
  } = useBeforeStartDrawing();
  if (!isDrawing) return null;
  return (
    <section
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
      })}
    >
      <div>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Draw
        </p>
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
        })}
      >
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Color
        </p>
        <PixelKitInputColor
          keyInput={`pixel-kit-draw`}
          color={color}
          onChangeColor={(e) => handleChangeColor(e)}
        />
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Thickness
        </p>
        <InputSlider value={thickness} onChange={handleThickness} />
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Line Join
        </p>
        <InputSelect
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
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Line Cap
        </p>
        <InputSelect
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
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Dash
        </p>
        <InputSlider
          onChange={(e) => handleDash("dash", e)}
          value={dash || 0}
        />
        <InputCheckbox
          text="Dash Enable"
          value={dashEnable ?? true}
          onCheck={(e) => handleDash("dashEnable", e)}
        />
      </div>
    </section>
  );
};
