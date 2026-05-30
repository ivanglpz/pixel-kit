import { Text } from "react-konva";
import { IShapeEvents } from "./type.shape";

import { useResolvedShape } from "../hooks/useResolvedShape";
import { ShapeIdentifier } from "./identifier";
export const ShapeText = (props: IShapeEvents) => {
  const shape = useResolvedShape(props);

  if (!shape.visible) return null;

  return (
    <>
      {props?.options?.showIdentifier ? (
        <ShapeIdentifier
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={props?.options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}
      <Text
        // 1. Identificación y referencia
        id={props?.options?.isLocked ? "" : shape?.id}
        parentId={shape.parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        fontFamily={shape.fontFamily}
        fontVariant={shape.fontVariant}
        text={shape.text}
        fontSize={shape.fontSize}
        lineHeight={1.45}
        listening={shape.listening}
        fillEnabled
        fill={shape.fillColor}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={false}
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
