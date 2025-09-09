/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */

// React
import { useState } from "react";

// Estado global (jotai)
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_IDS_ATOM } from "../states/shape";

// Konva

// Tipos
import { apply } from "./apply";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// Eventos de shape

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

export const ShapeImage = ({ options, shape }: IShapeWithEvents) => {
  // Estado local vinculado al átomo
  const [box, setBox] = useAtom(
    shape.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  // Extraer relleno de tipo imagen
  const fill = box.fills
    ?.filter((e) => e?.visible && e?.type === "image")
    .at(0);
  // const { width, height, x, y, strokeWidth, dash, rotation } = box;

  // Memoización de la imagen base
  // const Imagee = useMemo(() => {
  //   const img = new Image();
  //   if (!fill) return img;
  //   img.src = fill?.image?.src;
  //   img.width = fill?.image?.width;
  //   img.height = fill?.image?.height;
  //   return img;
  // }, [fill]);

  // Configuración de crop para object-fit cover
  // const cropConfig = useMemo(
  //   () =>
  //     calculateCoverCrop(
  //       fill?.image?.width || 0,
  //       fill?.image?.height || 0,
  //       Number(box.width),
  //       Number(box.height)
  //     ),
  //   [fill, box]
  // );

  // Refs para shape y transformer

  // Estado global
  const stage = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    e.stopPropagation();
    setDragging(true);
    setOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelected) return;

    e.stopPropagation();
    if (!dragging) return;
    setBox({
      ...box,
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    if (!isSelected) return;

    setDragging(false);
  };
  // Sombra

  if (!box.visible) return null;

  // =========================
  // Renderizado
  // =========================
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        setShapeId({
          id: box?.id,
          parentId: box.parentId,
        });
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: options?.isLayout ? "static" : "absolute",
        top: box.y,
        left: box.x,
        width: box.width,
        height: box.height,
        // minWidth: box.minWidth,
        // maxWidth: box.maxWidth,
        // minHeight: box.minHeight,
        // maxHeight: box.maxHeight,
        cursor: "move",
      }}
    >
      <img
        src={fill?.image?.src}
        alt="test"
        style={{
          width: box.width,
          height: box.height,
          opacity: box.opacity,
          // minWidth: box.minWidth,
          // maxWidth: box.maxWidth,
          // minHeight: box.minHeight,
          // maxHeight: box.maxHeight,
          ...apply.backgroundColor(box),
          ...apply.borderRadius(box),
          ...apply.stroke(box),
          ...apply.strokeDash(box),
          ...apply.shadow(box),
          pointerEvents: "none",
        }}
      />
    </div>
  );
  // return (
  //   <>
  //     <KonvaImage
  //       // 1. Identificación y referencia
  //       id={box?.id}
  //       parentId={box?.parentId}
  //       // 2. Posición y tamaño
  //       x={x}
  //       y={y}
  //       width={box?.width}
  //       height={box?.height}
  //       points={box.points ?? []}
  //       globalCompositeOperation="source-over"
  //       image={Imagee}
  //       // 3. Rotación
  //       rotation={rotation}
  //       // rotationDeg={rotate}
  //       listening={!box.isLocked}
  //       // 4. Relleno
  //       fillEnabled
  //       fill={
  //         box?.fills?.filter((e) => e?.type === "fill" && e?.visible)?.at(0)
  //           ?.color
  //       }
  //       // 5. Bordes y trazos
  //       stroke={box?.strokes?.filter((e) => e?.visible)?.at(0)?.color}
  //       strokeWidth={strokeWidth}
  //       strokeEnabled={box.strokeWidth > 0}
  //       dash={[dash, dash, dash, dash]}
  //       dashEnabled={box?.dash > 0}
  //       // 6. Crop (object-fit: cover)
  //       crop={cropConfig}
  //       cornerRadius={
  //         !box?.isAllBorderRadius
  //           ? [
  //               box.borderTopLeftRadius,
  //               box.borderTopRightRadius,
  //               box.borderBottomRightRadius,
  //               box.borderBottomLeftRadius,
  //             ]
  //           : box.borderRadius
  //       }
  //       // 7. Sombras
  //       shadowColor={shadow?.color}
  //       shadowOpacity={box.shadowOpacity}
  //       shadowOffsetX={box?.shadowOffsetX}
  //       shadowOffsetY={box?.shadowOffsetY}
  //       shadowBlur={box?.shadowBlur}
  //       shadowEnabled={Boolean(shadow)}
  //       // 8. Apariencia
  //       opacity={box?.opacity ?? 1}
  //       // 9. Interactividad
  //       draggable={isSelected}
  //       // 10. Eventos

  //       onClick={() =>
  //         setShapeId({
  //           id: box?.id,
  //           parentId: box.parentId,
  //         })
  //       }
  //       onDragMove={(e) =>
  //         setBox(shapeEventDragMove(e, stage.width, stage.height))
  //       }
  //       onTransform={(e) => {
  //         const scaleX = e.target.scaleX();
  //         const scaleY = e.target.scaleY();
  //         e.target.scaleX(1);
  //         e.target.scaleY(1);
  //         const payload = coordinatesShapeMove(
  //           box,
  //           stage.width,
  //           stage.height,
  //           e
  //         );

  //         setBox({
  //           ...payload,
  //           rotation: e.target.rotation(),
  //           width: Math.max(5, e.target.width() * scaleX),
  //           height: Math.max(e.target.height() * scaleY),
  //         });
  //       }}
  //     />
  //   </>
  // );
};
