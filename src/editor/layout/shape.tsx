import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { Section } from "@/editor/components/section";
import { useSelectedShape } from "@/editor/hooks";
import useShapes from "@/editor/hooks/useShapes";
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
    fontSize,
    lineCap,
    lineJoin,
    fontWeight,
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
  const { handleDeleteShapeInShapes } = useShapes();
  const { handleCleanShapeSelected } = useSelectedShape();
  const handleDelete = () => {
    handleDeleteShapeInShapes(id ?? "");
    handleCleanShapeSelected();
  };

  return (
    <Section title="Shape" onDelete={handleDelete}>
      <div
        className={`${css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
          height: "100%",
        })} scrollbar_container`}
      >
        <Valid isValid={tool === "IMAGE"}>
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
              opacity: 0,
              display: "none",
            })}
          />
        </Valid>
        <Valid isValid={tool === "DRAW"}>
          <InputCheckbox
            text="Bucket Fill"
            value={closed ?? false}
            onCheck={(e) => onChange("closed", e)}
          />
        </Valid>
        {/* <Valid isValid={tool !== "IMAGE"}> */}
        <InputCheckbox
          text="Fill"
          value={fillEnabled ?? true}
          onCheck={(e) => onChange("fillEnabled", e)}
        />
        {/* </Valid> */}
        <Valid isValid={fillEnabled ?? false}>
          <PixelKitInputColor
            labelText="Fill Color"
            keyInput={`pixel-kit-shape-fill-${id}-${tool}`}
            color={backgroundColor}
            onChangeColor={(e) => onChange("backgroundColor", e)}
          />
        </Valid>

        <Valid isValid={tool === "LINE" || tool === "DRAW"}>
          <InputSelect
            labelText="Line Join"
            value={lineJoin ?? "round"}
            onChange={(e) => onChange("lineJoin", e)}
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
            value={lineCap ?? "round"}
            onChange={(e) => onChange("lineCap", e)}
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
        </Valid>
        <Valid isValid={tool === "TEXT"}>
          <InputSelect
            labelText="Font Weight"
            value={fontWeight ?? "normal"}
            onChange={(e) => onChange("fontWeight", e)}
            options={[
              {
                id: `font-weight-lighter`,
                label: "Lighter",
                value: "lighter",
              },
              {
                id: `font-weight-normal`,
                label: "Normal",
                value: "normal",
              },
              {
                id: `font-weight-medium`,
                label: "Medium",
                value: "500",
              },
              {
                id: `font-weight-semi-bold`,
                label: "Semi Bold",
                value: "600",
              },
              {
                id: `font-weight-bold`,
                label: "Bold",
                value: "bold",
              },
              {
                id: `font-weight-bolder`,
                label: "Bolder",
                value: "bolder",
              },
            ]}
          />
          <InputSlider
            labelText="Font size"
            min={12}
            max={72}
            step={4}
            onChange={(e) => onChange("fontSize", e)}
            value={fontSize || 0}
          />
        </Valid>
        <InputCheckbox
          text="Stroke"
          value={strokeEnabled ?? true}
          onCheck={(e) => onChange("strokeEnabled", e)}
        />
        <Valid isValid={strokeEnabled ?? false}>
          <PixelKitInputColor
            labelText="Color"
            keyInput={`pixel-kit-shape-stroke-${id}-${tool}`}
            color={stroke}
            onChangeColor={(e) => onChange("stroke", e)}
          />
          <InputSlider
            labelText={`Thickness (${strokeWidth})`}
            onChange={(e) => onChange("strokeWidth", e)}
            value={strokeWidth || 0}
          />
        </Valid>

        <InputCheckbox
          text="Dash"
          value={dashEnabled ?? true}
          onCheck={(e) => onChange("dashEnabled", e)}
        />
        <Valid isValid={dashEnabled ?? false}>
          <InputSlider
            labelText={`Array (${dash})`}
            onChange={(e) => onChange("dash", e)}
            value={dash || 0}
          />
        </Valid>

        <InputCheckbox
          text="Shadow"
          value={shadowEnabled ?? true}
          onCheck={(e) => onChange("shadowEnabled", e)}
        />
        <Valid isValid={shadowEnabled ?? false}>
          <PixelKitInputColor
            labelText="Color"
            keyInput={`pixel-kit-shape-shadow-${id}-${tool}`}
            color={shadowColor}
            onChangeColor={(e) => onChange("shadowColor", e)}
          />
          <InputSlider
            labelText="X"
            onChange={(e) => onChange("shadowOffsetX", e)}
            value={shadowOffsetX || 0}
          />
          <InputSlider
            labelText="Y"
            onChange={(e) => onChange("shadowOffsetY", e)}
            value={shadowOffsetY || 0}
          />
          <InputSlider
            labelText="Blur"
            onChange={(e) => onChange("shadowBlur", e)}
            value={shadowBlur || 0}
          />

          <InputSlider
            min={0}
            labelText="Opacity"
            max={1}
            step={0.1}
            onChange={(e) => onChange("shadowOpacity", e)}
            value={shadowOpacity || 0}
          />
        </Valid>

        <InputSlider
          labelText="Border radius"
          onChange={(e) => onChange("borderRadius", e)}
          value={borderRadius || 0}
        />
      </div>
    </Section>
  );
};
