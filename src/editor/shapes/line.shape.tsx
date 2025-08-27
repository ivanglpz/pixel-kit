/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { memo } from "react";
import { Line } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";

export const ShapeLine = memo(({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { width, height, x, y, strokeWidth, dash } = box;

  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.includes(box.id);

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  if (!box.visible) return null;

  return (
    <>
      <Line
        // 1. Identificación y referencia
        id={box?.id}
        // 2. Posición y tamaño
        x={x}
        y={y}
        width={width}
        height={height}
        points={box.points ?? [5, 70, 140, 23]}
        listening={!box.isLocked}
        globalCompositeOperation="source-over"
        // 3. Rotación
        // rotationDeg={rotate}
        // 4. Relleno y color
        // fillEnabled={box?.fills?.filter((e) => e?.visible)?.length > 0}
        fillEnabled
        fill={
          box?.fills?.filter((e) => e?.type === "fill" && e?.visible)?.at(0)
            ?.color
        }
        // 5. Bordes y trazos
        stroke={box?.strokes?.filter((e) => e?.visible)?.at(0)?.color}
        strokeWidth={strokeWidth}
        strokeEnabled={box.strokeWidth > 0}
        dash={[dash, dash, dash, dash]}
        dashEnabled={box?.dash > 0}
        cornerRadius={
          box?.isAllBorderRadius ? box.bordersRadius : box.borderRadius
        }
        // 6. Sombras
        shadowColor={shadow?.color}
        shadowOpacity={box.shadowOpacity}
        shadowOffsetX={box?.shadowOffsetX}
        shadowOffsetY={box?.shadowOffsetY}
        shadowBlur={box?.shadowBlur}
        shadowEnabled={Boolean(shadow)}
        // 7. Apariencia y opacidad
        opacity={box?.opacity ?? 1}
        // 8. Interactividad y arrastre
        draggable={isSelected}
        // 9. Eventos
        onTap={() => setShapeId(box?.id)}
        onClick={() => setShapeId(box?.id)}
        onDragStart={(e) => setBox(ShapeEventDragStart(e))}
        onDragMove={(e) =>
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          )
        }
        onDragEnd={(e) => setBox(shapeEventDragStop(e))}
        onTransform={(e) => {
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          );
          setBox(shapeTransformEnd(e));
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
    </>
  );
});
