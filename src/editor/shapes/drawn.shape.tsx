/* eslint-disable react/display-name */
import { Line } from "react-konva";
import { IShapeEvents } from "./type.shape";

import { useResolvedShape } from "../hooks/useResolvedShape";
import { ShapeLabel } from "./label";

export const ShapeDraw = (props: IShapeEvents) => {
  const shape = useResolvedShape(props);

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
      <Line
        id={props?.options?.isLocked ? "" : shape?.id}
        parentId={shape.parentId}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        points={shape.points}
        rotation={shape.rotation}
        globalCompositeOperation="source-over"
        listening={shape.listening}
        fillEnabled
        fill={shape.fillColor}
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
        // 7. Interactividad y arrastre
        draggable={shape.isSelected}
        {...shape.events}
      />
    </>
  );
};
