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
import { useConfiguration } from "../hooks/useConfiguration";
import { shapeEventDragMove } from "./events.shape";
import { flexLayoutAtom } from "./layout-flex";
import { TransformDimension } from "./transform";

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
  const fill = box.fills
    ?.filter((e) => e?.visible && e?.type === "image")
    .at(0);
  const { width, height, x, y, strokeWidth, dash, rotation } = box;
  const applyLayout = useSetAtom(flexLayoutAtom);

  // Memoización de la imagen base
  const Imagee = useMemo(() => {
    const img = new Image();
    if (!fill) return img;
    img.src = fill?.image?.src;
    img.crossOrigin = "Anonymous";

    img.width = fill?.image?.width;
    img.height = fill?.image?.height;
    return img;
  }, [fill]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        fill?.image?.width || 0,
        fill?.image?.height || 0,
        Number(box.width),
        Number(box.height)
      ),
    [fill, box]
  );

  // Refs para shape y transformer

  // Estado global
  const { config } = useConfiguration();

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  // Sombra
  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

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
