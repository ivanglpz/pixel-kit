/* eslint-disable react/display-name */
import { useAtom, useSetAtom } from "jotai";
import { Line } from "react-konva";
import { IShapeEvents } from "./type.shape";

/* eslint-disable react/display-name */
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";

import { useMemo } from "react";
import stageAbsolutePosition from "../helpers/position";
import { RESOLVE_DROP_TARGET } from "../states/shapes";
import { useResolvedShape } from "./frame.shape";
import { ShapeLabel } from "./label";
import { flexLayoutAtom } from "./layout-flex";

export const ShapeDraw = (props: IShapeEvents) => {
  const shape = useResolvedShape(props.shape);
  const { setX, setY, setWidth, setHeight, setRotation } = shape;
  const applyLayout = useSetAtom(flexLayoutAtom);

  // const shadow = useAtomValue(effects.at(0)?.color)
  const SET_COORDS = useSetAtom(RESOLVE_DROP_TARGET);

  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === shape.id),
    [shapeId, shape.id],
  );
  const listening = useMemo(() => {
    if (props?.options?.isLocked) {
      return false;
    }
    return !shape.isLocked;
  }, [props?.options?.isLocked, shape.isLocked]);
  if (!shape.visible) return null;

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
      <Line
        // 1. Identificación y referencia
        id={props?.options?.isLocked ? "" : shape?.id}
        parentId={shape.parentId}
        // 2. Posición y tamaño - calculada manualmente para rotación
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        points={shape.points}
        rotation={shape.rotation}
        globalCompositeOperation="source-over"
        // Sin offset - calculamos todo manualmente
        // offsetX={width / 2}
        // offsetY={height / 2}
        // Sin offset - calculamos todo manualmente
        listening={listening}
        // 3. Relleno y color
        fillEnabled
        fill={shape.fillColor}
        // 4. Bordes y trazos
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeEnabled={shape.strokeWidth > 0}
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
        onDragEnd={(e) => {
          const { x, y } = stageAbsolutePosition(e);
          SET_COORDS({ x, y }); // o el setter de tu estado de mouse
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
