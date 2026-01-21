import { useMemo } from "react";
import { Image as KonvaImage } from "react-konva";
import { useResolvedShape } from "../hooks/useResolvedShape";
import { calculateCoverCrop } from "../utils/crop";
import { SVG } from "../utils/svg";
import { ShapeLabel } from "./label";
import { IShapeEvents } from "./type.shape";

export const SHAPE_ICON = (props: IShapeEvents) => {
  const shape = useResolvedShape(props);
  const IMG = shape.IMG;

  const IMAGE_ICON = useMemo(() => {
    const img = new Image();
    if (!IMG?.src) return img;

    const svgText = SVG.Decode(IMG.src);

    const newSvg = svgText
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${shape.strokeWidth}"`)
      .replace(
        /stroke="currentColor"/g,
        `stroke="${shape.strokeColor || "#000000"}"`,
      );

    img.src = SVG.Encode(newSvg);
    img.crossOrigin = "Anonymous";
    img.width = IMG.width;
    img.height = IMG.height;
    return img;
  }, [IMG?.src, IMG?.width, IMG?.height, shape.strokeColor, shape.strokeWidth]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        IMG?.width || 0,
        IMG?.height || 0,
        Number(shape.width),
        Number(shape.height),
      ),
    [IMG?.width, IMG?.height, shape.width, shape.height],
  );

  if (!shape.visible) return null;

  return (
    <>
      {props?.options?.showLabel ? (
        <ShapeLabel
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={props?.options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}
      <KonvaImage
        id={props?.options?.isLocked ? "" : shape?.id}
        image={IMAGE_ICON}
        crop={cropConfig}
        parentId={shape.parentId}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        listening={shape.listening}
        fillEnabled
        fill={"transparent"}
        dash={[shape.dash]}
        dashEnabled={shape.dash > 0}
        cornerRadius={
          !shape.isAllBorderRadius
            ? [
                shape.borderTopLeftRadius,
                shape.borderTopRightRadius,
                shape.borderBottomRightRadius,
                shape.borderBottomLeftRadius,
              ]
            : shape.borderRadius
        }
        shadowColor={shape.shadowColor}
        shadowOpacity={shape.shadowOpacity}
        shadowOffsetX={shape.shadowOffsetX}
        shadowOffsetY={shape.shadowOffsetY}
        shadowBlur={shape.shadowBlur}
        shadowEnabled
        opacity={shape.opacity}
        draggable={shape.isSelected}
        {...shape.events}
      />
    </>
  );
};
