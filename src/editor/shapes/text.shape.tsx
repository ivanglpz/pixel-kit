import { Text } from "react-konva";
import { IShapeEvents } from "./type.shape";

import { useMemo } from "react";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
export const ShapeText = (props: IShapeEvents) => {
  const shape = useResolvedShape(props.shape);

  const listening = useMemo(() => {
    if (props?.options?.isLocked) {
      return false;
    }
    return !shape.isLocked;
  }, [props?.options?.isLocked, shape.isLocked]);
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
        listening={listening}
        fillEnabled
        fill={shape.fillColor}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={false}
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
