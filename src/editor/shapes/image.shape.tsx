import { useMemo } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";

import { Image as KonvaImage } from "react-konva";

import { IShapeEvents } from "./type.shape";

import { calculateCoverCrop } from "../utils/crop";
import { flexLayoutAtom } from "./layout-flex";

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

  const RENDER_IMAGE = useMemo(() => {
    const img = new Image();
    if (!IMG?.src) return img;

    img.src = IMG.src;
    img.crossOrigin = "Anonymous";
    img.width = IMG.width;
    img.height = IMG.height;
    return img;
  }, [IMG?.src, IMG?.width, IMG?.height]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        IMG?.width || 0,
        IMG?.height || 0,
        Number(width),
        Number(height)
      ),
    [IMG?.width, IMG?.height, width, height]
  );
  if (!visible) return null;

  return (
    <>
      <KonvaImage
        // 1. Identificación y referencia
        id={box?.id}
        image={RENDER_IMAGE}
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
          !isAllBorderRadius
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
