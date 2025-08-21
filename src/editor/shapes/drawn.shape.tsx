/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useRef } from "react";
import { Line } from "react-konva";
import { Transform } from "./transformer";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

/* eslint-disable react/display-name */
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";
import { ShapeEventDragStart } from "./events.shape";

import {
  shapeEventDragMove,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";

type LineDimensions = {
  width: number;
  height: number;
};

const calculateLineDimensions = (
  points: number[] | undefined
): LineDimensions => {
  if (!points || points.length < 2) {
    return { width: 0, height: 0 };
  }

  let minX: number = points[0];
  let minY: number = points[1];
  let maxX: number = points[0];
  let maxY: number = points[1];

  for (let i = 0; i < points.length; i += 2) {
    const x: number = points[i];
    const y: number = points[i + 1];

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  return {
    width: Math.max(maxX - minX, 1),
    height: Math.max(maxY - minY, 1),
  };
};

export const ShapeDraw = memo(({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { x, y, strokeWidth, dash, rotation } = box;

  const shapeRef = useRef<Konva.Line>();
  const trRef = useRef<Konva.Transformer>();

  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
  const isSelected = shapeId === box?.id;

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && box.visible) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, trRef, shapeRef, box.visible]);

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  if (!box.visible) return null;

  return (
    <>
      <Line
        // 1. Identificación y referencia
        id={box?.id}
        ref={shapeRef as MutableRefObject<Konva.Line>}
        // 2. Posición y tamaño
        x={x}
        y={y}
        rotation={rotation}
        listening={!box.isLocked}
        points={box.points ?? []}
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
        draggable={shapeId === box?.id}
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
        onTransform={(e) =>
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          )
        }
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});
