/* eslint-disable react/display-name */
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Line } from "react-konva";
import { IShapeEvents } from "./type.shape";

/* eslint-disable react/display-name */
import { SHAPE_IDS_ATOM } from "../states/shape";

import { useMemo } from "react";
import { useFillColor } from "../hooks/useFillColor";
import { useShadowColor } from "../hooks/useShadowColor";
import { useStrokeColor } from "../hooks/useStrokeColor";
import { flexLayoutAtom } from "./layout-flex";

export const ShapeDraw = (props: IShapeEvents) => {
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
  const shadow = useShadowColor(box.effects);
  const parentId = useAtomValue(box.parentId);
  const strokeColor = useStrokeColor(box.strokes);
  const fillColor = useFillColor(box.fills);
  const points = useAtomValue(box.points);
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

  // const shadow = useAtomValue(effects.at(0)?.color)
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );

  if (!visible) return null;

  return (
    <>
      <Line
        // 1. Identificación y referencia
        id={box?.id}
        parentId={parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={x}
        y={y}
        width={width}
        height={height}
        points={points}
        rotation={rotation}
        globalCompositeOperation="source-over"
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
        strokeEnabled={strokeWidth > 0}
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
        shadowColor={shadow.color}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        shadowEnabled={Boolean(shadow.enabled)}
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
