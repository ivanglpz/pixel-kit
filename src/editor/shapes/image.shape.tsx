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
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// Eventos de shape
import { coordinatesShapeMove, TransformDimension } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";

// Transformer

// =========================
// Utilidades
// =========================

// Calcula un recorte de imagen estilo "object-fit: cover"
function calculateCoverCrop(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number
) {
  const imageRatio = imageWidth / imageHeight;
  const containerRatio = containerWidth / containerHeight;

  let cropX = 0;
  let cropY = 0;
  let cropWidth = imageWidth;
  let cropHeight = imageHeight;

  if (imageRatio > containerRatio) {
    // Imagen más ancha → recortar lados
    cropWidth = imageHeight * containerRatio;
    cropX = (imageWidth - cropWidth) / 2;
  } else {
    // Imagen más alta → recortar arriba y abajo
    cropHeight = imageWidth / containerRatio;
    cropY = (imageHeight - cropHeight) / 2;
  }

  return { x: cropX, y: cropY, width: cropWidth, height: cropHeight };
}

// =========================
// Componente ShapeImage
// =========================

export const ShapeImage = (props: IShapeWithEvents) => {
  // Estado local vinculado al átomo
  const [box, setBox] = useAtom(
    props?.shape.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  // Extraer relleno de tipo imagen
  const fillImage = useMemo(
    () => box.fills?.filter((e) => e?.visible && e?.type === "image").at(0),
    [box.fills]
  );
  const { x, y, strokeWidth, rotation } = box;
  const applyLayout = useSetAtom(flexLayoutAtom);

  // Memoización de la imagen base
  const Imagee = useMemo(() => {
    const img = new Image();
    if (!fillImage) return img;
    img.src = fillImage?.image?.src;
    img.crossOrigin = "Anonymous";

    img.width = fillImage?.image?.width;
    img.height = fillImage?.image?.height;
    return img;
  }, [
    fillImage?.image?.src,
    fillImage?.image?.width,
    fillImage?.image?.height,
  ]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        fillImage?.image?.width || 0,
        fillImage?.image?.height || 0,
        Number(box.width),
        Number(box.height)
      ),
    [fillImage?.image?.width, fillImage?.image?.height, box.width, box.height]
  );

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
