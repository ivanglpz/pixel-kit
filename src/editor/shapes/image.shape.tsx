/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */

// React
import { memo, MutableRefObject, useEffect, useMemo, useRef } from "react";

// Estado global (jotai)
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";

// Konva
import Konva from "konva";
import { Image as KonvaImage } from "react-konva";

// Tipos
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// Eventos de shape
import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";

// Transformer
import { Transform } from "./transformer";

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

export const ShapeImage = memo((props: IShapeWithEvents) => {
  // Estado local vinculado al átomo
  const [box, setBox] = useAtom(
    props?.shape.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  // Extraer relleno de tipo imagen
  const fill = box.fills
    ?.filter((e) => e?.visible && e?.type === "image")
    .at(0);
  const { rotate, x, y, strokeWidth, dash } = box;

  // Memoización de la imagen base
  const Imagee = useMemo(() => {
    const img = new Image();
    if (!fill) return img;
    img.src = fill?.image?.src;
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
  const shapeRef = useRef<Konva.Image>();
  const trRef = useRef<Konva.Transformer>();

  // Estado global
  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
  const isSelected = shapeId === box?.id;

  // Sombra
  const shadow = box?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);

  // Vincular transformer cuando se selecciona
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current && box.visible) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, trRef, shapeRef, box.visible]);

  if (!box.visible) return null;

  // =========================
  // Renderizado
  // =========================
  return (
    <>
      <KonvaImage
        // 1. Identificación y referencia
        id={box?.id}
        ref={shapeRef as MutableRefObject<Konva.Image>}
        // 2. Posición y tamaño
        x={x}
        y={y}
        width={box?.width}
        height={box?.height}
        points={box.points ?? []}
        globalCompositeOperation="source-over"
        image={Imagee}
        // 3. Rotación
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
        dash={[dash, dash, dash, dash]}
        dashEnabled={box?.dash > 0}
        // 6. Crop (object-fit: cover)
        crop={cropConfig}
        cornerRadius={
          box?.isAllBorderRadius ? box.bordersRadius : box.borderRadius
        }
        // 7. Sombras
        shadowColor={shadow?.color}
        shadowOpacity={shadow?.opacity}
        shadowOffsetX={shadow?.x}
        shadowOffsetY={shadow?.y}
        shadowBlur={shadow?.blur}
        shadowEnabled={
          Number(
            box?.effects?.filter((e) => e?.visible && e?.type === "shadow")
              ?.length
          ) > 0
        }
        // 8. Apariencia
        opacity={box?.opacity ?? 1}
        // 9. Interactividad
        draggable={shapeId === box?.id}
        // 10. Eventos
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
