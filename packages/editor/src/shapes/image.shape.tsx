import { useMemo } from "react";
import { Image as KonvaImage } from "react-konva";

import { useKonvaImage } from "../hooks/useKonvaImage";
import { useResolvedShape } from "../hooks/useResolvedShape";
import { calculateCoverCrop } from "../utils/crop";
import { ShapeLabel } from "./label";
import { IShapeEvents } from "./type.shape";

export const ShapeImage = (props: IShapeEvents) => {
  const { options } = props;
  const shape = useResolvedShape(props);
  const IMG = shape.IMG;
  const RENDER_IMAGE = useKonvaImage(IMG);

  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        RENDER_IMAGE.width,
        RENDER_IMAGE.height,
        Number(shape.width),
        Number(shape.height),
      ),
    [RENDER_IMAGE.width, RENDER_IMAGE.height, shape.width, shape.height],
  );

  if (!shape.visible) return null;

  return (
    <>
      {options?.showLabel ? (
        <ShapeLabel
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}
      <KonvaImage
        // Identity
        id={options?.isLocked ? "" : shape?.id}
        image={RENDER_IMAGE.image}
        crop={cropConfig}
        parentId={shape.parentId}
        globalCompositeOperation="source-over"
        // Position and size
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        // Interaction
        listening={shape.listening}
        draggable={shape.isSelected}
        // Fill
        fillEnabled
        fill={shape.fillColor}
        // Stroke
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={shape.strokeWidth > 0}
        dash={[shape.dash]}
        dashEnabled={shape.dash > 0}
        cornerRadius={
          shape.isAllBorderRadius
            ? [
                shape.borderTopLeftRadius,
                shape.borderTopRightRadius,
                shape.borderBottomRightRadius,
                shape.borderBottomLeftRadius,
              ]
            : shape.borderRadius
        }
        // 5. Sombras
        shadowColor={shape.shadowColor}
        shadowOpacity={shape.shadowOpacity}
        shadowOffsetX={shape.shadowOffsetX}
        shadowOffsetY={shape.shadowOffsetY}
        shadowBlur={shape.shadowBlur}
        shadowEnabled
        // 6. Apariencia y opacidad
        opacity={shape.opacity}
        {...shape.events}
      />
    </>
  );
};
