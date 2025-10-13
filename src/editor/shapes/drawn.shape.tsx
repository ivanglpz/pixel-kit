/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { Line } from "react-konva";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

/* eslint-disable react/display-name */
import { SHAPE_IDS_ATOM } from "../states/shape";

import { useMemo } from "react";
import { coordinatesShapeMove, TransformDimension } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";

export const ShapeDraw = ({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const applyLayout = useSetAtom(flexLayoutAtom);

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );

  const shadow = useMemo(
    () => box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0),
    [box.effects]
  );

  const stroke = useMemo(
    () => box?.strokes?.filter((e) => e?.visible)?.at(0),
    [box?.strokes]
  );
  const fill = useMemo(
    () => box?.fills?.filter((e) => e?.type === "fill" && e?.visible)?.at(0),
    [box.fills]
  );

  if (!box.visible) return null;

  return (
    <>
      <Line
        // 1. Identificación y referencia
        id={box?.id}
        parentId={box?.parentId}
        // 2. Posición y tamaño
        x={box.x}
        y={box.y}
        rotation={box.rotation}
        listening={!box.isLocked}
        points={box.points ?? []}
        globalCompositeOperation="source-over"
        // 3. Rotación
        // rotationDeg={rotate}
        // 4. Relleno y color
        // fillEnabled={box?.fills?.filter((e) => e?.visible)?.length > 0}
        fillEnabled
        fill={fill?.color}
        // 5. Bordes y trazos
        stroke={stroke?.color}
        strokeWidth={box.strokeWidth}
        strokeEnabled={box.strokeWidth > 0}
        dash={[box.dash]}
        dashEnabled={box?.dash > 0}
        cornerRadius={
          !box?.isAllBorderRadius
            ? [
                box.borderTopLeftRadius,
                box.borderTopRightRadius,
                box.borderBottomRightRadius,
                box.borderBottomLeftRadius,
              ]
            : box.borderRadius
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
        onDragMove={(evt) => setBox((prev) => coordinatesShapeMove(prev, evt))}
        onDragEnd={() => {
          if (!box.parentId) return;
          applyLayout({ id: box.parentId });
        }}
        onTransform={(e) => {
          const dimension = TransformDimension(e, box);
          setBox(dimension);
        }}
        onTransformEnd={() => {
          if (box?.parentId) {
            applyLayout({ id: box.parentId });
          }
        }}
      />
    </>
  );
};
