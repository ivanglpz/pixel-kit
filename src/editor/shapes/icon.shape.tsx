/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */

// React
import { useMemo } from "react";

// Estado global (jotai)
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SHAPE_IDS_ATOM } from "../states/shape";

// Konva
import { Image as KonvaImage } from "react-konva";

// Tipos
import { IShapeEvents } from "./type.shape";

// Eventos de shape
import { useFillColor } from "../hooks/useFillColor";
import { useShadowColor } from "../hooks/useShadowColor";
import { useStrokeColor } from "../hooks/useStrokeColor";
import { calculateCoverCrop } from "../utils/crop";
import { flexLayoutAtom } from "./layout-flex";

// Transformer

// =========================
// Utilidades
// =========================

// Calcula un recorte de imagen estilo "object-fit: cover"

// =========================
// Componente ShapeImage
// =========================

export const SHAPE_ICON = (props: IShapeEvents) => {
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
  const shadow = useShadowColor(box.effects);
  const parentId = useAtomValue(box.parentId);
  const fills = useAtomValue(box.fills);
  const strokeColor = useStrokeColor(box.strokes);
  const fillColor = useFillColor(box.fills);
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
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === box.id),
    [shapeId, box.id]
  );
  const IMG = useMemo(
    () => fills?.filter((e) => e?.visible && e?.type === "image").at(0),
    [fills]
  );
  const IMAGE_ICON = useMemo(() => {
    const img = new Image();
    if (!IMG?.image?.src) return img;
    const CONTENT = "data:image/svg+xml;charset=utf-8,";

    const svgText = decodeURIComponent(IMG.image.src.replace(CONTENT, ""));

    const newSvg = svgText
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
      .replace(
        /stroke="currentColor"/g,
        `stroke="${strokeColor || "#000000"}"`
      );

    img.src = CONTENT + encodeURIComponent(newSvg);
    img.crossOrigin = "Anonymous";
    img.width = IMG.image.width;
    img.height = IMG.image.height;
    return img;
  }, [
    IMG?.image?.src,
    IMG?.image?.width,
    IMG?.image?.height,
    strokeColor,
    strokeWidth,
  ]);

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
        image={IMAGE_ICON}
        crop={cropConfig}
        parentId={parentId}
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
        shadowColor={shadow.color}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        shadowEnabled={Boolean(shadow.enabled)}
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
