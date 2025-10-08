import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { Rect } from "react-konva";
import { useConfiguration } from "../hooks/useConfiguration";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { shapeEventDragMove } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";
import { TransformDimension } from "./transform";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = ({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const { config } = useConfiguration();
  const rotation = Number(box.rotation) || 0;
  const applyLayout = useSetAtom(flexLayoutAtom);

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);
  // Calcular la posición ajustada para la rotación

  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  if (!box.visible) return null;

  return (
    <>
      <Rect
        // 1. Identificación y referencia
        id={box?.id}
        parentId={box?.parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rotation={rotation}
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
        strokeWidth={box.strokeWidth}
        strokeEnabled={box.strokeWidth > 0}
        // dash={[dash, dash, dash, dash]}
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
        onClick={() => {
          setShapeId({
            id: box?.id,
            parentId: box.parentId,
          });
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
        onDragEnd={() => {
          if (!box.parentId) return;
          applyLayout({ id: box.parentId });
        }}
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

export default ShapeBox;
