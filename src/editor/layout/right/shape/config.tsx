import PixelKitInputColor from "@/editor/components/input-color";
import { InputSlider } from "@/editor/components/input-slider";
import { IShape } from "@/editor/elements/type";
// import { IShape } from "@/editor/elements/type";
import { IKeyMethods } from "@/editor/hooks/tool/types";
import { css } from "@stylespixelkit/css";

type TChange = (key: keyof IShape, value: string | number) => void;

type Props = {
  id: string;
  tool: IKeyMethods;
  fillColor: string | undefined;
  strokeColor: string | undefined;
  shadowColor: string | undefined;
  borderRadius: number;
  onChange: TChange;
};

const ShapeConfig = ({
  fillColor,
  id,
  tool,
  strokeColor,
  shadowColor,
  onChange,
  borderRadius,
}: Props) => {
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
        color={fillColor}
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
        color={strokeColor}
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
        value={borderRadius}
      />
    </div>
  );
};

export default ShapeConfig;
