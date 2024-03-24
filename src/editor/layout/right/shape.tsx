import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSlider } from "@/editor/components/input-slider";
import { IShape } from "@/editor/shapes/type.shape";
import { css } from "@stylespixelkit/css";
import { useRef, ChangeEvent } from "react";

type TChange = (key: keyof IShape, value: string | number | boolean) => void;

type Props = {
  shape: IShape;
  onChange: TChange;
};

const calculateScale = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const widthScale: number = containerWidth / originalWidth;
  const heightScale: number = containerHeight / originalHeight;

  const scale: number = Math.min(widthScale, heightScale);

  return scale;
};

export const LayoutShapeConfig = (props: Props) => {
  const {
    backgroundColor,
    id,
    tool,
    stroke,
    shadowColor,
    borderRadius,
    strokeWidth,
    fillEnabled,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowEnabled,
    strokeEnabled,
    dash,
    dashEnabled,
    shadowOpacity,
    closed,
  } = props.shape;
  const onChange = props.onChange;

  const inputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        const scale: number = calculateScale(
          image.width,
          image.height,
          props.shape.width ?? 500,
          props.shape.height ?? 500
        );

        const newWidth: number = image.width * scale;
        const newHeight: number = image.height * scale;

        onChange("src", reader?.result as string);
        onChange("width", newWidth);
        onChange("height", newHeight);
      };

      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
      <header>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Shape
        </p>
      </header>
      <div
        className={`${css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
          height: "100%",
          maxHeight: "20rem",
          overflow: "hidden",
          overflowY: "hidden",
          _hover: {
            overflowY: "scroll",
          },
        })} scrollbar_container`}
      >
        <InputCheckbox
          text="Closed"
          value={closed ?? false}
          onCheck={(e) => onChange("closed", e)}
        />
        <InputCheckbox
          text="Fill Enable"
          value={fillEnabled ?? true}
          onCheck={(e) => onChange("fillEnabled", e)}
        />

        <PixelKitInputColor
          labelText=" Fill Color"
          keyInput={`pixel-kit-shape-fill-${id}-${tool}`}
          color={backgroundColor}
          onChangeColor={(e) => onChange("backgroundColor", e)}
        />

        <PixelKitInputColor
          labelText="Stroke Color"
          keyInput={`pixel-kit-shape-stroke-${id}-${tool}`}
          color={stroke}
          onChangeColor={(e) => onChange("stroke", e)}
        />

        <InputSlider
          labelText="Stroke With"
          onChange={(e) => onChange("strokeWidth", e)}
          value={strokeWidth || 0}
        />
        <InputCheckbox
          text="Stroke Enable"
          value={strokeEnabled ?? true}
          onCheck={(e) => onChange("strokeEnabled", e)}
        />

        <InputSlider
          labelText="Dash"
          onChange={(e) => onChange("dash", e)}
          value={dash || 0}
        />
        <InputCheckbox
          text="Dash Enable"
          value={dashEnabled ?? true}
          onCheck={(e) => onChange("dashEnabled", e)}
        />

        <PixelKitInputColor
          labelText="Shadow Color"
          keyInput={`pixel-kit-shape-shadow-${id}-${tool}`}
          color={shadowColor}
          onChangeColor={(e) => onChange("shadowColor", e)}
        />
        <InputSlider
          labelText="Shadow X"
          onChange={(e) => onChange("shadowOffsetX", e)}
          value={shadowOffsetX || 0}
        />
        <InputSlider
          labelText="Shadow Y"
          onChange={(e) => onChange("shadowOffsetY", e)}
          value={shadowOffsetY || 0}
        />
        <InputSlider
          labelText="Shadow Blur"
          onChange={(e) => onChange("shadowBlur", e)}
          value={shadowBlur || 0}
        />
        <InputCheckbox
          text="Shadow Enable"
          value={shadowEnabled ?? true}
          onCheck={(e) => onChange("shadowEnabled", e)}
        />
        <InputSlider
          min={0}
          labelText="Shadow Opacity"
          max={1}
          step={0.1}
          onChange={(e) => onChange("shadowOpacity", e)}
          value={shadowOpacity || 0}
        />

        <InputSlider
          labelText="Border radius"
          onChange={(e) => onChange("borderRadius", e)}
          value={borderRadius || 0}
        />
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Image
        </p>
        <Button
          text="Browser Files"
          onClick={() => inputRef.current?.click()}
        />
        <input
          ref={inputRef}
          type="file"
          color="white"
          accept="image/*"
          onChange={handleFiles}
          className={css({
            backgroundColor: "red",
            width: 0,
            height: 0,
          })}
        />
      </div>
    </section>
  );
};
