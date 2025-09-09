/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom } from "jotai";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";
/* eslint-disable react/display-name */
import { useAtomValue } from "jotai";
import { useState } from "react";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { apply } from "./apply";

export const ShapeText = ({ shape: item, options }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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
  if (!box.visible) return null;

  return (
    <div
      id={box?.id}
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
        opacity: box.opacity,
        fontSize: box.fontSize,
        // minWidth: box.minWidth,
        // maxWidth: box.maxWidth,
        // minHeight: box.minHeight,
        // maxHeight: box.maxHeight,
        overflow: "hidden",
        cursor: "move",
        ...apply.borderRadius(box),
        ...apply.stroke(box),
        ...apply.strokeDash(box),
        ...apply.shadow(box),
        ...apply.flex(box),
        ...apply.padding(box),

        // overflowY: "scroll",
        // overflowX: "hidden",
        // padding: 20,
        // display: "flex",
        // flexDirection: "column",
      }}
    >
      <p
        style={{
          width: box.width,
          height: box.height,
          opacity: box.opacity,
          fontSize: box.fontSize,
          wordBreak: "break-all",
          margin: 0,
          padding: 0,
          ...apply.color(box),
          "-webkit-text-stroke": "2px red",
          textShadow: "3px 3px 0px rgb(0,0,0)",
        }}
      >
        {box.text}
      </p>
    </div>
  );
  // return (
  //   <>
  //     <Text
  //       // 1. Identificación y referencia
  //       id={box?.id}
  //       parentId={box?.parentId}
  //       // 2. Posición y tamaño
  //       x={x}
  //       y={y}
  //       width={width}
  //       height={height}
  //       points={box.points ?? [5, 70, 140, 23]}
  //       globalCompositeOperation="source-over"
  //       fontFamily={box?.fontFamily}
  //       fontVariant={box?.fontWeight}
  //       text={box?.text}
  //       listening={!box.isLocked}
  //       fontSize={box?.fontSize}
  //       lineHeight={1.45}
  //       rotation={rotation}
  //       // 3. Rotación
  //       // rotationDeg={rotate}
  //       // 4. Relleno y color
  //       // fillEnabled={box?.fills?.filter((e) => e?.visible)?.length > 0}
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
  //       // 6. Sombras
  //       shadowColor={shadow?.color}
  //       shadowOpacity={box.shadowOpacity}
  //       shadowOffsetX={box?.shadowOffsetX}
  //       shadowOffsetY={box?.shadowOffsetY}
  //       shadowBlur={box?.shadowBlur}
  //       shadowEnabled={Boolean(shadow)}
  //       // 7. Apariencia y opacidad
  //       opacity={box?.opacity ?? 1}
  //       // 8. Interactividad y arrastre
  //       draggable={isSelected}
  //       // 9. Eventos
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
