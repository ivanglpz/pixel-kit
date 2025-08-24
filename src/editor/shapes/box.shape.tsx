import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { memo } from "react";
import { Rect } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { ADD_SHAPE_ID_ATOM } from "../states/shape";
import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = memo(({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { width, height, x, y, strokeWidth, dash } = box;
  const rotation = Number(box.rotation) || 0;

  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(ADD_SHAPE_ID_ATOM);
  const isSelected = shapeId.includes(box.id);

  // Calcular la posición ajustada para la rotación

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  const offsetX = box.isCreating ? 0 : width / 2;
  const offsetY = box.isCreating ? 0 : height / 2;

  if (!box.visible) return null;

  return (
    <>
      <Rect
        // 1. Identificación y referencia
        id={box?.id}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={!box.isLocked}
        // 3. Relleno y color
        fillEnabled
        fill={
          box?.fills?.filter((e) => e?.type === "fill" && e?.visible)?.at(0)
            ?.color
        }
        // 4. Bordes y trazos
        stroke={box?.strokes?.filter((e) => e?.visible)?.at(0)?.color}
        strokeWidth={strokeWidth}
        strokeEnabled={box.strokeWidth > 0}
        dash={[dash, dash, dash, dash]}
        dashEnabled={box?.dash > 0}
        cornerRadius={
          box?.isAllBorderRadius ? box.bordersRadius : box.borderRadius
        }
        // 5. Sombras
        shadowColor={shadow?.color}
        shadowOpacity={box.shadowOpacity}
        shadowOffsetX={box?.shadowOffsetX}
        shadowOffsetY={box?.shadowOffsetY}
        shadowBlur={box?.shadowBlur}
        shadowEnabled={Boolean(shadow)}
        // 6. Apariencia y opacidad
        opacity={box?.opacity ?? 1}
        // 7. Interactividad y arrastre
        draggable={isSelected}
        // 8. Eventos
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
          setBox({
            ...box,
            rotation: e.target.rotation(),
            ...shapeEventDragMove(
              e,
              stageDimensions.width,
              stageDimensions.height
            ),
          });
          setBox(shapeTransformEnd(e));
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
    </>
  );
});

export default ShapeBox;
