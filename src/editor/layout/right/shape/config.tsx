import PixelKitInputColor from "@/editor/components/input-color";
import { InputSlider } from "@/editor/components/input-slider";
import { IShape } from "@/editor/shapes/type.shape";
import { css } from "@stylespixelkit/css";

type TChange = (key: keyof IShape, value: string | number) => void;

type Props = {
  shape: IShape;
  onChange: TChange;
};

const LayoutShapeConfig = (props: Props) => {
  const { backgroundColor, id, tool, stroke, shadowColor, borderRadius } =
    props.shape;
  const onChange = props.onChange;
  return (
    <div
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
            fontSize: "md",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Shape Appearance
        </p>
      </div>
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Fill Color
      </p>
      <PixelKitInputColor
        keyInput={`pixel-kit-shape-fill-${id}-${tool}`}
        color={backgroundColor}
        onChangeColor={(e) => onChange("backgroundColor", e)}
      />
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Stroke Color
      </p>
      <PixelKitInputColor
        keyInput={`pixel-kit-shape-stroke-${id}-${tool}`}
        color={stroke}
        onChangeColor={(e) => onChange("stroke", e)}
      />
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Shadow Color
      </p>
      <PixelKitInputColor
        keyInput={`pixel-kit-shape-shadow-${id}-${tool}`}
        color={shadowColor}
        onChangeColor={(e) => onChange("shadowColor", e)}
      />
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Border radius
      </p>
      <InputSlider
        onChange={(e) => onChange("borderRadius", e)}
        value={borderRadius || 0}
      />
    </div>
  );
};

export default LayoutShapeConfig;
