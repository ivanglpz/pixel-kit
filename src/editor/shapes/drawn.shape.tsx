/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom } from "jotai";
import { Line } from "react-konva";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

/* eslint-disable react/display-name */
import { useAtomValue } from "jotai";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_IDS_ATOM } from "../states/shape";

import { coordinatesShapeMove, shapeEventDragMove } from "./events.shape";

export const ShapeDraw = ({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { x, y, strokeWidth, dash, rotation } = box;

  const stage = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  if (!box.visible) return null;

  return (
    <>
      <Line
        // 1. Identificación y referencia
        id={box?.id}
        parentId={box?.parentId}
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
        draggable={isSelected}
        // 9. Eventos

        onClick={() =>
          setShapeId({
            id: box?.id,
            parentId: box.parentId,
          })
        }
        onDragMove={(e) =>
          setBox(shapeEventDragMove(e, stage.width, stage.height))
        }
        onTransform={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          e.target.scaleX(1);
          e.target.scaleY(1);
          const payload = coordinatesShapeMove(
            box,
            stage.width,
            stage.height,
            e
          );

          setBox({
            ...payload,
            rotation: e.target.rotation(),
            width: Math.max(5, e.target.width() * scaleX),
            height: Math.max(e.target.height() * scaleY),
          });
        }}
      />
    </>
  );
};
