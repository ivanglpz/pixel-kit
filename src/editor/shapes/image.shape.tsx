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

function urlToBase64(
  url: string,
  callback: (b64: string | ArrayBuffer) => void
) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result ?? "");
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.error("Error al convertir URL a base64:", error);
    });
}

export const ShapeImage = memo(({ item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const { width, height, rotate, x, y, strokeWidth, dash } = box;
  const imageInstance = useMemo(() => {
    if (box?.src?.includes("data:image")) {
      const image = new Image();
      image.src = box.src ?? "";
      return image;
    }

    const image = new Image();
    urlToBase64(box.src ?? "", (b64) => (image.src = b64 as string));
    return image;
  }, [box.src]);
  // const { isSelected } = item;
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

  return (
    <>
      {/* <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setImage}
          shape={image}
        />
      </Valid> */}
      <KonvaImage
        // 1. Identificación y referencia
        id={box?.id}
        ref={shapeRef as MutableRefObject<Konva.Image>}
        // 2. Posición y tamaño
        x={x}
        y={y}
        width={width}
        height={height}
        points={box.points ?? []}
        globalCompositeOperation="source-over"
        image={imageInstance}
        // 3. Rotación
        rotationDeg={rotate}
        // 4. Relleno y color
        fillEnabled={box?.fills?.filter((e) => e?.visible)?.length > 0}
        fill={box?.fills?.filter((e) => e?.visible)?.at(0)?.color}
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
        onTransform={(e) =>
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          )
        }
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
      <Transform isSelected={isSelected} ref={trRef} keepRatio />
    </>
  );
});
