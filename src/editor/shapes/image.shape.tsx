import { useEffect, useMemo, useState } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";

import { Image as KonvaImage } from "react-konva";

import { IShapeEvents } from "./type.shape";

import { calculateCoverCrop } from "../utils/crop";
import { flexLayoutAtom } from "./layout-flex";

type ImageSource = {
  src?: string;
  width?: number;
  height?: number;
};

const PLACEHOLDER_SRC = "/placeholder.svg";
const PLACEHOLDER_SIZE = 1200;

function buildImage(
  src: string,
  width: number,
  height: number,
  onError?: () => void
): HTMLImageElement {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = src;
  img.width = width;
  img.height = height;

  if (onError) {
    img.onerror = onError;
  }

  return img;
}
export function useKonvaImage(img: ImageSource) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [img.src]);

  return useMemo(() => {
    if (!img.src || hasError) {
      return {
        image: buildImage(PLACEHOLDER_SRC, PLACEHOLDER_SIZE, PLACEHOLDER_SIZE),
        width: PLACEHOLDER_SIZE,
        height: PLACEHOLDER_SIZE,
      };
    }

    return {
      image: buildImage(
        img.src,
        img.width ?? PLACEHOLDER_SIZE,
        img.height ?? PLACEHOLDER_SIZE,
        () => setHasError(true)
      ),
      width: img.width ?? PLACEHOLDER_SIZE,
      height: img.height ?? PLACEHOLDER_SIZE,
    };
  }, [img.src, img.width, img.height, hasError]);
}
export const ShapeImage = (props: IShapeEvents) => {
  const { shape: item } = props;
  const box = useAtomValue(item.state);
  const [rotation, setRotation] = useAtom(box.rotation);
  const [x, setX] = useAtom(box.x);
  const [y, setY] = useAtom(box.y);
  const [width, setWidth] = useAtom(box.width);
  const [height, setHeight] = useAtom(box.height);
  const visible = useAtomValue(box.visible);
  const applyLayout = useSetAtom(flexLayoutAtom);
  const isLocked = useAtomValue(box.isLocked);
  const parentId = useAtomValue(box.parentId);
  const shadowColor = useAtomValue(box.shadowColor);
  const strokeColor = useAtomValue(box.strokeColor);
  const fillColor = useAtomValue(box.fillColor);
  const strokeWidth = useAtomValue(box.strokeWidth);
  const dash = useAtomValue(box.dash);
  const isAllBorderRadius = useAtomValue(box.isAllBorderRadius);
  const borderTopLeftRadius = useAtomValue(box.borderTopLeftRadius);
  const borderTopRightRadius = useAtomValue(box.borderTopRightRadius);
  const borderBottomRightRadius = useAtomValue(box.borderBottomRightRadius);
  const borderBottomLeftRadius = useAtomValue(box.borderBottomLeftRadius);
  const borderRadius = useAtomValue(box.borderRadius);
  const shadowOpacity = useAtomValue(box.shadowOpacity);
  const shadowOffsetX = useAtomValue(box.shadowOffsetX);
  const shadowOffsetY = useAtomValue(box.shadowOffsetY);
  const shadowBlur = useAtomValue(box.shadowBlur);
  const opacity = useAtomValue(box.opacity);

  // const shadow = useAtomValue(effects.at(0)?.color)
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );
  const IMG = useAtomValue(box.image);

  const RENDER_IMAGE = useKonvaImage(IMG);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        RENDER_IMAGE?.width || 0,
        RENDER_IMAGE?.height || 0,
        Number(width),
        Number(height)
      ),
    [RENDER_IMAGE?.width, RENDER_IMAGE?.height, width, height]
  );
  if (!visible) return null;

  return (
    <>
      <KonvaImage
        // 1. Identificación y referencia
        id={box?.id}
        image={RENDER_IMAGE.image}
        crop={cropConfig}
        parentId={parentId}
        globalCompositeOperation="source-over"
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={!isLocked}
        // 3. Relleno y color
        fillEnabled
        fill={fillColor}
        // 4. Bordes y trazos
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeEnabled={strokeWidth > 0}
        // dash={[dash, dash, dash, dash]}
        dash={[dash]}
        dashEnabled={dash > 0}
        cornerRadius={
          isAllBorderRadius
            ? [
                borderTopLeftRadius,
                borderTopRightRadius,
                borderBottomRightRadius,
                borderBottomLeftRadius,
              ]
            : borderRadius
        }
        // 5. Sombras
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        shadowEnabled
        // 6. Apariencia y opacidad
        opacity={opacity}
        // 7. Interactividad y arrastre
        draggable={isSelected}
        // 8. Eventos
        onClick={() => {
          setShapeId({
            id: box?.id,
            parentId: parentId,
          });
        }}
        onDragMove={(evt) => {
          setX(evt.target.x());
          setY(evt.target.y());
        }}
        onDragEnd={() => {
          if (!parentId) return;
          applyLayout({ id: parentId });
        }}
        onTransform={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          e.target.scaleX(1);
          e.target.scaleY(1);
          setRotation(e.target.rotation());
          setWidth(Math.max(5, e.target.width() * scaleX));
          setHeight(Math.max(e.target.height() * scaleY));
        }}
        onTransformEnd={() => {
          if (!parentId) return;
          applyLayout({ id: parentId });
        }}
      />
    </>
  );
};
