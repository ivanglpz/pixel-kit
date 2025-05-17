/* eslint-disable react/display-name */
import Konva from "konva";
import { memo, MutableRefObject, useEffect, useRef, useState } from "react";
import { Line } from "react-konva";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";
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
import { PrimitiveAtom, useAtom } from "jotai";

export const ShapeLine = memo((item: IShapeWithEvents) => {
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

  const [box, setBox] = useAtom(
    item.shape as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

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
    closed,
    strokeEnabled,
    dash,
    points,
    dashEnabled,
    lineCap,
    lineJoin,
  } = box;

  const shapeRef = useRef<Konva.Line>();
  const trRef = useRef<Konva.Transformer>();

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
      <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setBox}
          shape={box}
        />
      </Valid>
      <Line
        id={box?.id}
        x={x}
        y={y}
        width={width}
        fillEnabled={fillEnabled ?? true}
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        closed={closed ?? false}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        lineCap={lineCap}
        lineJoin={lineJoin}
        strokeEnabled={strokeEnabled ?? true}
        points={points ?? [5, 70, 140, 23]}
        globalCompositeOperation="source-over"
        shadowEnabled={shadowEnabled ?? true}
        dashEnabled={dashEnabled ?? true}
        dash={[dash, dash, dash, dash]}
        cornerRadius={borderRadius}
        fill={backgroundColor}
        ref={shapeRef as MutableRefObject<Konva.Line>}
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
