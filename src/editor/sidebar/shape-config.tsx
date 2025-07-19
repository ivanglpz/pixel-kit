import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import PixelKitInputColor from "@/editor/components/input-color";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { IShape } from "@/editor/shapes/type.shape";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { ChangeEvent, useRef } from "react";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "../states/shape";
import { DELETE_SHAPE_ATOM } from "../states/shapes";

type TChange = (key: keyof IShape, value: string | number | boolean) => void;

type Props = {
  // shape: IShape;
  // onChange: TChange;
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
  // const onChange = props.onChange;

  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);

  if (shape === null) return null;

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
  } = shape;
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        // const scale: number = calculateScale(
        //   image.width,
        //   image.height,
        //   props.shape.width ?? 500,
        //   props.shape.height ?? 500
        // );
        // const newWidth: number = image.width * scale;
        // const newHeight: number = image.height * scale;
        // onChange("src", reader?.result as string);
        // onChange("width", newWidth);
        // onChange("height", newHeight);
      };

      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    // if (!id) return;
    // DELETE_SHAPE({ id });
    // handleCleanShapeSelected();
  };

  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
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
      <p>x: {shape?.x}</p>
      <p>y: {shape?.y}</p>
      <p>width: {shape?.width}</p>
      <p>height: {shape?.height}</p>
      <Valid isValid={tool === "DRAW"}>
        <InputCheckbox
          text="Bucket Fill"
          value={closed ?? false}
          onCheck={(e) => {
            shapeUpdate({
              closed: e,
            });
          }}
        />
      </Valid>
      {/* <Valid isValid={tool !== "IMAGE"}> */}
      <InputCheckbox
        text="Fill"
        value={fillEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            fillEnabled: e,
          });
          // onChange("fillEnabled", e)
        }}
      />
      {/* </Valid> */}
      <Valid isValid={fillEnabled ?? false}>
        <PixelKitInputColor
          labelText="Fill Color"
          keyInput={`pixel-kit-shape-fill-${id}-${tool}`}
          color={backgroundColor}
          onChangeColor={(e) => {
            // onChange("backgroundColor", e)

            shapeUpdate({
              backgroundColor: e,
            });
          }}
          primaryColors
        />
      </Valid>

      <Valid isValid={tool === "LINE" || tool === "DRAW"}>
        <InputSelect
          labelText="Line Join"
          value={lineJoin ?? "round"}
          onChange={(e) => {
            shapeUpdate({
              lineJoin: e as LineJoin,
            });
            // onChange("lineJoin", e)
          }}
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
          onChange={(e) => {
            shapeUpdate({
              lineCap: e as LineCap,
            });
            // onChange("lineCap", e)
          }}
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
          onChange={(e) => {
            shapeUpdate({
              fontWeight: e as IShape["fontWeight"],
            });
            // onChange("fontWeight", e)
          }}
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
          onChange={(e) => {
            shapeUpdate({
              fontSize: e,
            });

            // onChange("fontSize", e)
          }}
          value={fontSize || 0}
        />
      </Valid>
      <InputCheckbox
        text="Stroke"
        value={strokeEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            strokeEnabled: e,
          });

          // onChange("strokeEnabled", e)
        }}
      />
      <Valid isValid={strokeEnabled ?? false}>
        <PixelKitInputColor
          labelText="Color"
          keyInput={`pixel-kit-shape-stroke-${id}-${tool}`}
          color={stroke}
          onChangeColor={(e) => {
            shapeUpdate({
              stroke: e,
            });

            // onChange("stroke", e)
          }}
        />
        <InputSlider
          labelText={`Thickness (${strokeWidth})`}
          onChange={(e) => {
            shapeUpdate({
              strokeWidth: e,
            });
            // onChange("strokeWidth", e)
          }}
          value={strokeWidth || 0}
        />
      </Valid>

      <InputCheckbox
        text="Dash"
        value={dashEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            dashEnabled: e,
          });

          // onChange("dashEnabled", e)
        }}
      />
      <Valid isValid={dashEnabled ?? false}>
        <InputSlider
          labelText={`Array (${dash})`}
          onChange={(e) => {
            shapeUpdate({
              dash: e,
            });

            // onChange("dash", e)
          }}
          value={dash || 0}
        />
      </Valid>

      <InputCheckbox
        text="Shadow"
        value={shadowEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            shadowEnabled: e,
          });

          // onChange("shadowEnabled", e)
        }}
      />
      <Valid isValid={shadowEnabled ?? false}>
        <PixelKitInputColor
          labelText="Color"
          keyInput={`pixel-kit-shape-shadow-${id}-${tool}`}
          color={shadowColor}
          onChangeColor={(e) => {
            shapeUpdate({
              shadowColor: e,
            });
            // onChange("shadowColor", e)
          }}
        />
        <InputSlider
          labelText="X"
          onChange={(e) => {
            shapeUpdate({
              shadowOffsetX: e,
            });
            // onChange("shadowOffsetX", e)
          }}
          value={shadowOffsetX || 0}
        />
        <InputSlider
          labelText="Y"
          onChange={(e) => {
            shapeUpdate({
              shadowOffsetY: e,
            });
            // onChange("shadowOffsetY", e)
          }}
          value={shadowOffsetY || 0}
        />
        <InputSlider
          labelText="Blur"
          onChange={(e) => {
            shapeUpdate({
              shadowBlur: e,
            });
            // onChange("shadowBlur", e)
          }}
          value={shadowBlur || 0}
        />

        <InputSlider
          min={0}
          labelText="Opacity"
          max={1}
          step={0.1}
          onChange={(e) => {
            shapeUpdate({
              shadowOpacity: e,
            });
            // onChange("shadowOpacity", e)
          }}
          value={shadowOpacity || 0}
        />
      </Valid>

      <InputSlider
        labelText="Border radius"
        onChange={(e) => {
          shapeUpdate({
            borderRadius: e,
          });
          // onChange("borderRadius", e)
        }}
        value={borderRadius || 0}
      />
    </div>
  );
};
