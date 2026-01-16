import { useMemo } from "react";

import { useAtom, useSetAtom } from "jotai";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";

import { Image as KonvaImage } from "react-konva";
import { calculateCoverCrop } from "../utils/crop";
import { SVG } from "../utils/svg";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

export const SHAPE_ICON = (props: IShapeEvents) => {
  const shape = useResolvedShape(props.shape);
  const { setX, setY, setWidth, setHeight, setRotation } = shape;
  const applyLayout = useSetAtom(flexLayoutAtom);
  const IMG = shape.IMG;

  // const shadow = useAtomValue(effects.at(0)?.color)
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === shape.id),
    [shapeId, shape.id]
  );

  const IMAGE_ICON = useMemo(() => {
    const img = new Image();
    if (!IMG?.src) return img;

    const svgText = SVG.Decode(IMG.src);

    const newSvg = svgText
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${shape.strokeWidth}"`)
      .replace(
        /stroke="currentColor"/g,
        `stroke="${shape.strokeColor || "#000000"}"`
      );

    img.src = SVG.Encode(newSvg);
    img.crossOrigin = "Anonymous";
    img.width = IMG.width;
    img.height = IMG.height;
    return img;
  }, [IMG?.src, IMG?.width, IMG?.height, shape.strokeColor, shape.strokeWidth]);

  // Configuración de crop para object-fit cover
  const cropConfig = useMemo(
    () =>
      calculateCoverCrop(
        IMG?.width || 0,
        IMG?.height || 0,
        Number(shape.width),
        Number(shape.height)
      ),
    [IMG?.width, IMG?.height, shape.width, shape.height]
  );

  const listening = useMemo(() => {
    if (props?.options?.isLocked) {
      return false;
    }
    return !shape.isLocked;
  }, [props?.options?.isLocked, shape.isLocked]);

  if (!shape.visible) return null;

  // =========================
  // Renderizado
  // =========================
  return (
    <>
      {props?.options?.showLabel ? (
        <ShapeLabel
          x={shape.x}
          y={shape.y}
          label={shape.label}
          color={props?.options?.background}
          isComponent={shape.isComponent}
        />
      ) : null}
      <KonvaImage
        // 1. Identificación y referencia
        id={props?.options?.isLocked ? "" : shape?.id}
        image={IMAGE_ICON}
        crop={cropConfig}
        parentId={shape.parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rotation={shape.rotation}
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={listening}
        // 3. Relleno y color
        fillEnabled
        fill={"transparent"}
        // 4. Bordes y trazos
        // dash={[dash, dash, dash, dash]}
        dash={[shape.dash]}
        dashEnabled={shape.dash > 0}
        cornerRadius={
          !shape.isAllBorderRadius
            ? [
                shape.borderTopLeftRadius,
                shape.borderTopRightRadius,
                shape.borderBottomRightRadius,
                shape.borderBottomLeftRadius,
              ]
            : shape.borderRadius
        }
        // 5. Sombras
        shadowColor={shape.shadowColor}
        shadowOpacity={shape.shadowOpacity}
        shadowOffsetX={shape.shadowOffsetX}
        shadowOffsetY={shape.shadowOffsetY}
        shadowBlur={shape.shadowBlur}
        shadowEnabled
        // 6. Apariencia y opacidad
        opacity={shape.opacity}
        // 7. Interactividad y arrastre
        draggable={isSelected}
        // 8. Eventos
        onClick={() => {
          setShapeId({
            id: props?.shape?.id,
            parentId: shape.parentId,
          });
        }}
        onDragMove={(evt) => {
          setX(evt.target.x());
          setY(evt.target.y());
        }}
        onDragEnd={() => {
          if (!shape.parentId) return;
          applyLayout({ id: shape.parentId });
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
          if (!shape.parentId) return;
          applyLayout({ id: shape.parentId });
        }}
      />
    </>
  );
};
