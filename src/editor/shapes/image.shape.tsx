/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";
import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { Transform } from "./transformer";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// Función para calcular crop con object-fit: cover
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
    // La imagen es más ancha que el contenedor
    // Recortamos los lados
    cropWidth = imageHeight * containerRatio;
    cropX = (imageWidth - cropWidth) / 2;
  } else {
    // La imagen es más alta que el contenedor
    // Recortamos arriba y abajo
    cropHeight = imageWidth / containerRatio;
    cropY = (imageHeight - cropHeight) / 2;
  }

  return {
    x: cropX,
    y: cropY,
    width: cropWidth,
    height: cropHeight,
  };
}

export const ShapeImage = memo((props: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    props?.item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const fill = box.fills
    ?.filter((e) => e?.visible && e?.type === "image")
    .at(0);

  const { rotate, x, y, strokeWidth, dash } = box;

  // const [imageFill, setImageFill] = useAtom(fill.image);

  const Imagee = useMemo(() => {
    const img = new Image();
    if (!fill) {
      return img;
    }
    img.src = fill?.image?.src;
    img.width = fill?.image?.width;
    img.height = fill?.image?.height;
    return img;
  }, [fill]);

  // Calcular crop para object-fit: cover
  const cropConfig = useMemo(() => {
    return calculateCoverCrop(
      fill?.image?.width || 0,
      fill?.image?.height || 0,
      Number(box.width),
      Number(box.height)
    );
  }, [fill, box]);

  const shapeRef = useRef<Konva.Image>();
  const trRef = useRef<Konva.Transformer>();
  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
  const isSelected = shapeId === box?.id;

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, trRef, shapeRef]);
  // if (!fill) return null;

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
        rotationDeg={rotate}
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
        // CROP CONFIGURADO PARA OBJECT-FIT: COVER
        crop={cropConfig}
        cornerRadius={
          box?.isAllBorderRadius ? box.bordersRadius : box.borderRadius
        }
        // 6. Sombras
        shadowColor={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.color
        }
        shadowOpacity={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.opacity
        }
        shadowOffsetX={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.x
        }
        shadowOffsetY={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.y
        }
        shadowBlur={
          box?.effects?.filter((e) => e?.visible && e?.type === "shadow").at(0)
            ?.blur
        }
        shadowEnabled={
          Number(
            box?.effects?.filter((e) => e?.visible && e?.type === "shadow")
              ?.length
          ) > 0
        }
        // 7. Apariencia y opacidad
        opacity={box?.opacity ?? 1}
        // 8. Interactividad y arrastre
        draggable={shapeId === box?.id}
        // 9. Eventos
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
