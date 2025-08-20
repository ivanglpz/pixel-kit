/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useRef } from "react";
import { Text } from "react-konva";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";
/* eslint-disable react/display-name */
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";

import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { Transform } from "./transformer";
export const ShapeText = memo(({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const { width, height, rotate, x, y, strokeWidth, dash } = box;

  const shapeRef = useRef<Konva.Text>();
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

  if (!box.visible) return null;
  return (
    <>
      <Text
        // 1. Identificación y referencia
        id={box?.id}
        ref={shapeRef as MutableRefObject<Konva.Text>}
        // 2. Posición y tamaño
        x={x}
        y={y}
        width={width}
        height={height}
        points={box.points ?? [5, 70, 140, 23]}
        globalCompositeOperation="source-over"
        fontFamily={box?.fontFamily}
        fontVariant={box?.fontWeight}
        text={box?.text}
        listening={!box.isLocked}
        fontSize={box?.fontSize}
        lineHeight={1.45}
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
        shadowColor={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.color
        }
        shadowOpacity={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.opacity
        }
        shadowOffsetX={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.x
        }
        shadowOffsetY={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.y
        }
        shadowBlur={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.blur
        }
        shadowEnabled={
          Number(
            box?.effects?.filter((e) => e?.visible && e?.type === "shadow")
              ?.length
          ) > 0
        }
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
        onTransform={(e) => {
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          );
          setBox(shapeTransformEnd(e));
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});
