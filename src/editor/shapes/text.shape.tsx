/* eslint-disable react/display-name */
import Konva from "konva";
import { memo, MutableRefObject, useEffect, useRef, useState } from "react";
import { Text } from "react-konva";
import { IShapeWithEvents } from "./type.shape";
import { KonvaEventObject } from "konva/lib/Node";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { Transform } from "./transformer";
import { PortalConfigShape } from "./config.shape";
import { PortalTextWriting } from "./text.writing";
import { Valid } from "@/components/valid";

export const ShapeText = memo((item: IShapeWithEvents) => {
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
    fontSize,
  } = box;

  const shapeRef = useRef<Konva.Text>();
  const trRef = useRef<Konva.Transformer>();

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    } else {
      setBox((prev) => ({ ...prev, isWritingNow: false }));
    }
  }, [isSelected, trRef, shapeRef]);

  useEffect(() => {
    setBox(item.shape);
  }, [item.shape]);

  return (
    <>
      <Valid isValid={box.isWritingNow}>
        <PortalTextWriting
          isSelected={isSelected}
          setShape={setBox}
          shape={box}
        />
      </Valid>
      <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setBox}
          shape={box}
        />
      </Valid>
      <Text
        id={box?.id}
        x={x}
        y={y}
        width={width}
        fontFamily="Plus Jakarta Sans"
        // fontVariant="bold"
        visible={!box.isWritingNow}
        text={box.text}
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
        ref={shapeRef as MutableRefObject<Konva.Text>}
        draggable={draggable}
        fontSize={fontSize ?? 0 + 5}
        lineHeight={1.45}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onDblClick={(e) => {
          setBox((prev) => ({
            ...prev,
            isWritingNow: true,
          }));
        }}
        onClick={(e) => setBox(shapeEventClick(e, onClick))}
        onDragStart={(e) => setBox(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) =>
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight))
        }
        onDragEnd={(e) => setBox(shapeEventDragStop(e, onDragStop))}
        onTransform={(e) => {
          setBox(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight));
          setBox(shapeTransformEnd(e, onDragMove));
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e, onDragStop))}
      />
      <Transform isSelected={isSelected && !box.isWritingNow} ref={trRef} />
    </>
  );
});
