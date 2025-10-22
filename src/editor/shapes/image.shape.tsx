/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */

// React
import { useMemo } from "react";

// Estado global (jotai)
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { SHAPE_IDS_ATOM } from "../states/shape";

// Konva
import { Image as KonvaImage } from "react-konva";

// Tipos
import { IShape, IShapeEvents, WithInitialValue } from "./type.shape";

// Eventos de shape
import { calculateCoverCrop } from "../utils/crop";
import { coordinatesShapeMove, TransformDimension } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";

// Transformer

// =========================
// Utilidades
// =========================

// Calcula un recorte de imagen estilo "object-fit: cover"

// =========================
// Componente ShapeImage
// =========================

export const ShapeImage = (props: IShapeEvents) => {
  // Estado local vinculado al átomo
  const [box, setBox] = useAtom(
    props?.shape.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  // Extraer relleno de tipo imagen
  const IMG = useMemo(
    () => box.fills?.filter((e) => e?.visible && e?.type === "image").at(0),
    [box.fills]
  );
  const { x, y, strokeWidth, rotation } = box;
  const applyLayout = useSetAtom(flexLayoutAtom);

  // Refs para shape y transformer

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );

  // Sombra
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

  const Imagee = useMemo(() => {
    const img = new Image();
    if (!IMG?.image?.src) return img;

    img.src = IMG.image.src;
    img.crossOrigin = "Anonymous";
    img.width = IMG.image.width;
    img.height = IMG.image.height;
    return img;
  }, [IMG?.image?.src, IMG?.image?.width, IMG?.image?.height, stroke?.color]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        IMG?.image?.width || 0,
        IMG?.image?.height || 0,
        Number(box.width),
        Number(box.height)
      ),
    [IMG?.image?.width, IMG?.image?.height, box.width, box.height]
  );

  if (!box.visible) return null;

  // =========================
  // Renderizado
  // =========================
  return (
    <>
      <KonvaImage
        // 1. Identificación y referencia
        id={box?.id}
        parentId={box?.parentId}
        // 2. Posición y tamaño
        x={x}
        y={y}
        width={box?.width}
        height={box?.height}
        points={box.points ?? []}
        globalCompositeOperation="source-over"
        image={Imagee}
        // 3. Rotación
        rotation={rotation}
        // rotationDeg={rotate}
        listening={!box.isLocked}
        // 4. Relleno
        fillEnabled
        fill={fill?.color}
        // 5. Bordes y trazos
        stroke={stroke?.color}
        strokeWidth={strokeWidth}
        strokeEnabled={box.strokeWidth > 0}
        dash={[box.dash]}
        dashEnabled={box?.dash > 0}
        // 6. Crop (object-fit: cover)
        crop={cropConfig}
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
        // 7. Sombras
        shadowColor={shadow?.color}
        shadowOpacity={box.shadowOpacity}
        shadowOffsetX={box?.shadowOffsetX}
        shadowOffsetY={box?.shadowOffsetY}
        shadowBlur={box?.shadowBlur}
        shadowEnabled={Boolean(shadow)}
        // 8. Apariencia
        opacity={box?.opacity ?? 1}
        // 9. Interactividad
        draggable={isSelected}
        // 10. Eventos

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
