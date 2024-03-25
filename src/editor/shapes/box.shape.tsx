import Konva from "konva";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";
import { IShapeWithEvents } from "./type.shape";
import { KonvaEventObject } from "konva/lib/Node";
import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
} from "./events.shape";
import { Transform } from "./transformer";

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

  const shapeTransformEnd = (evt: KonvaEventObject<Event>) => {
    setBox((prev) => {
      if (shapeRef?.current) {
        const scaleX = evt.target.scaleX();
        const scaleY = evt.target.scaleY();
        evt.target.scaleX(1);
        evt.target.scaleY(1);
        const payload = {
          ...prev,
          x: evt.target.x(),
          y: evt.target.y(),
          rotate,
          width: Math.max(5, evt.target.width() * scaleX),
          height: Math.max(evt.target.height() * scaleY),
        };
        onDragStop(payload);

        return payload;
      }
      return prev;
    });
  };

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
      <PortalConfigShape
        isSelected={isSelected}
        setShape={setBox}
        shape={box}
      />
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
        onClick={(e) => setBox(shapeEventClick(e, onClick))}
        onDragStart={(e) => setBox(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) =>
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight))
        }
        onDragEnd={(e) => setBox(shapeEventDragStop(e, onDragStop))}
        onTransform={(e) => {
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight));
        }}
        onTransformEnd={shapeTransformEnd}
      />
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});

export default ShapeBox;
