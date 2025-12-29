import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Text } from "react-konva";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import { IShapeEvents } from "./type.shape";

import { useMemo } from "react";
import { flexLayoutAtom } from "./layout-flex";
export const ShapeText = (props: IShapeEvents) => {
  const { shape: item } = props;
  const box = useAtomValue(item.state);
  const [rotation, setRotation] = useAtom(box.rotation);
  const [x, setX] = useAtom(box.x);
  const [y, setY] = useAtom(box.y);
  const [width, setWidth] = useAtom(box.width);
  const [height, setHeight] = useAtom(box.height);
  const visible = useAtomValue(box.visible);
  const applyLayout = useSetAtom(flexLayoutAtom);
  const isLocked = useAtomValue(box.isLocked);
  const parentId = useAtomValue(box.parentId);
  const shadowColor = useAtomValue(box.shadowColor);
  const strokeColor = useAtomValue(box.strokeColor);
  const fillColor = useAtomValue(box.fillColor);
  const strokeWidth = useAtomValue(box.strokeWidth);
  const dash = useAtomValue(box.dash);
  const isAllBorderRadius = useAtomValue(box.isAllBorderRadius);
  const borderTopLeftRadius = useAtomValue(box.borderTopLeftRadius);
  const borderTopRightRadius = useAtomValue(box.borderTopRightRadius);
  const borderBottomRightRadius = useAtomValue(box.borderBottomRightRadius);
  const borderBottomLeftRadius = useAtomValue(box.borderBottomLeftRadius);
  const borderRadius = useAtomValue(box.borderRadius);
  const shadowOpacity = useAtomValue(box.shadowOpacity);
  const shadowOffsetX = useAtomValue(box.shadowOffsetX);
  const shadowOffsetY = useAtomValue(box.shadowOffsetY);
  const shadowBlur = useAtomValue(box.shadowBlur);
  const opacity = useAtomValue(box.opacity);
  const fontFamily = useAtomValue(box.fontFamily);
  const fontVariant = useAtomValue(box.fontWeight);
  const text = useAtomValue(box.text);
  const fontSize = useAtomValue(box.fontSize);
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );

  if (!visible) return null;

  return (
    <>
      <Text
        // 1. Identificación y referencia
        id={box?.id}
        parentId={parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        fontFamily={fontFamily}
        fontVariant={fontVariant}
        text={text}
        fontSize={fontSize}
        lineHeight={1.45}
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={!isLocked}
        // 3. Relleno y color
        fillEnabled
        fill={fillColor}
        // 4. Bordes y trazos
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeEnabled={false}
        // dash={[dash, dash, dash, dash]}
        dash={[dash]}
        dashEnabled={dash > 0}
        cornerRadius={
          !isAllBorderRadius
            ? [
                borderTopLeftRadius,
                borderTopRightRadius,
                borderBottomRightRadius,
                borderBottomLeftRadius,
              ]
            : borderRadius
        }
        // 5. Sombras
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        shadowEnabled
        // 6. Apariencia y opacidad
        opacity={opacity}
        // 7. Interactividad y arrastre
        draggable={isSelected}
        // 8. Eventos
        onClick={() => {
          setShapeId({
            id: box?.id,
            parentId: parentId,
          });
        }}
        onDragMove={(evt) => {
          setX(evt.target.x());
          setY(evt.target.y());
        }}
        onDragEnd={() => {
          if (!parentId) return;
          applyLayout({ id: parentId });
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
          if (!parentId) return;
          applyLayout({ id: parentId });
        }}
      />
    </>
  );
};
