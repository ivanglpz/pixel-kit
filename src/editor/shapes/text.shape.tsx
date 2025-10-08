/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { Text } from "react-konva";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";
/* eslint-disable react/display-name */
import { SHAPE_IDS_ATOM } from "../states/shape";

import { useConfiguration } from "../hooks/useConfiguration";
import { shapeEventDragMove } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";
import { TransformDimension } from "./transform";
export const ShapeText = (props: IShapeWithEvents) => {
  const { shape: item } = props;
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const { width, height, x, y, strokeWidth, dash, rotation } = box;

  const { config } = useConfiguration();
  const applyLayout = useSetAtom(flexLayoutAtom);

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  if (!box.visible) return null;
  return (
    <>
      <Text
        // 1. Identificación y referencia
        id={box?.id}
        parentId={box?.parentId}
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
        rotation={rotation}
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
        onDragEnd={() => {
          if (!box.parentId) return;
          applyLayout({ id: box.parentId });
        }}
        onDragMove={(e) =>
          setBox(
            shapeEventDragMove(
              e,
              Number(config.expand_stage_resolution?.width),
              Number(config.expand_stage_resolution?.height)
            )
          )
        }
        onTransform={(e) => {
          const dimension = TransformDimension(
            e,
            box,
            config.expand_stage_resolution
          );
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
