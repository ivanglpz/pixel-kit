import PixelKitInputColor from "@/editor/components/input-color";
// import { IShape } from "@/editor/elements/type";
import { IKeyMethods } from "@/editor/hooks/tool/types";
import { css } from "@stylespixelkit/css";

type TChange = (value: string) => void;

type Props = {
  id: string;
  tool: IKeyMethods;
  fillColor: string | undefined;
  strokeColor: string | undefined;
  shadowColor: string | undefined;
  onChangeFillColor: TChange;
  onChangeStrokeColor: TChange;
  onChangeShadowColor: TChange;
};

const ShapeConfig = ({
  fillColor,
  onChangeFillColor,
  onChangeShadowColor,
  onChangeStrokeColor,
  id,
  tool,
  strokeColor,
  shadowColor,
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
        onChangeColor={onChangeFillColor}
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
        onChangeColor={onChangeStrokeColor}
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
        onChangeColor={onChangeShadowColor}
      />
    </div>
  );
};

export default ShapeConfig;
