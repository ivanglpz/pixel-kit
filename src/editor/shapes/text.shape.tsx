import { useAtom, useSetAtom } from "jotai";
import { Text } from "react-konva";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import { IShapeEvents } from "./type.shape";

import { useMemo } from "react";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
import { flexLayoutAtom } from "./layout-flex";
export const ShapeText = (props: IShapeEvents) => {
  const shape = useResolvedShape(props.shape);
  const { setX, setY, setWidth, setHeight, setRotation } = shape;
  const applyLayout = useSetAtom(flexLayoutAtom);
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === shape.id),
    [shapeId, shape.id]
  );

  const listening = useMemo(() => {
    if (props?.options?.mirror?.isLocked) {
      return false;
    }
    return !shape.isLocked;
  }, [props?.options?.mirror?.isLocked, shape.isLocked]);
  if (!shape.visible) return null;

  return (
    <>
      <ShapeLabel
        x={shape.x}
        y={shape.y}
        label={shape.label}
        color={props?.options?.background}
      />
      <Text
        // 1. Identificación y referencia
        id={props?.options?.mirror?.isLocked ? "" : shape?.id}
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
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={listening}
        // 3. Relleno y color
        fillEnabled
        fill={shape.fillColor}
        // 4. Bordes y trazos
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={false}
        // dash={[dash, dash, dash, dash]}
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
        draggable={isSelected}
        // 8. Eventos
        onClick={() => {
          setShapeId({
            id: props?.shape?.id,
            parentId: shape.parentId,
          });
        }}
        onDragMove={(evt) => {
          setX(evt.target.x());
          setY(evt.target.y());
        }}
        onDragEnd={() => {
          if (!shape.parentId) return;
          applyLayout({ id: shape.parentId });
        }}
        onTransform={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          e.target.scaleX(1);
          e.target.scaleY(1);
          setRotation(e.target.rotation());
          setWidth(Math.max(5, e.target.width() * scaleX));
          setHeight(Math.max(e.target.height() * scaleY));
        }}
        onTransformEnd={() => {
          if (!shape.parentId) return;
          applyLayout({ id: shape.parentId });
        }}
      />
    </>
  );
};
