import Konva from "konva";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";
import { IShapeWithEvents } from "./type.shape";
import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { Transform } from "./transformer";
import { Valid } from "@/components/valid";

// eslint-disable-next-line react/display-name
const ShapeBox = memo((item: IShapeWithEvents) => {
  const {
    draggable,
    isSelected,
    onClick,
    onDragMove,
    onDragStart,
    onDragStop,
    screenHeight,
    screenWidth,
  } = item;

  const [box, setBox] = useState(() => {
    return item.shape;
  });

  const {
    width,
    height,
    shadowColor,
    shadowOpacity,
    rotate,
    x,
    y,
    shadowOffsetY,
    shadowOffsetX,
    shadowBlur,
    stroke,
    strokeWidth,
    backgroundColor,
    borderRadius,
    fillEnabled,
    shadowEnabled,
    strokeEnabled,
    dash,
    dashEnabled,
  } = box;

  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, trRef, shapeRef]);

  useEffect(() => {
    setBox(item.shape);
  }, [item.shape]);

  return (
    <>
      <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setBox}
          shape={box}
        />
      </Valid>
      <Rect
        id={box?.id}
        x={x}
        y={y}
        width={width}
        fillEnabled={fillEnabled ?? true}
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        strokeEnabled={strokeEnabled ?? true}
        shadowEnabled={shadowEnabled ?? true}
        dashEnabled={dashEnabled ?? true}
        dash={[dash, dash, dash, dash]}
        cornerRadius={borderRadius}
        fill={backgroundColor}
        ref={shapeRef as MutableRefObject<Konva.Rect>}
        draggable={draggable}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onTap={(e) => setBox(shapeEventClick(e, onClick))}
        onClick={(e) => setBox(shapeEventClick(e, onClick))}
        onDragStart={(e) => setBox(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) =>
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight))
        }
        onDragEnd={(e) => setBox(shapeEventDragStop(e, onDragStop))}
        onTransform={(e) => {
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight));
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e, onDragStop))}
      />
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});

export default ShapeBox;
