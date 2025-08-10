/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useEffect, useRef } from "react";
import { Line } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";
import { Transform } from "./transformer";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
export const ShapeLine = memo(({ item }: IShapeWithEvents) => {
  // const {
  //   draggable,
  //   isSelected,
  //   onClick,
  //   onDragMove,
  //   onDragStart,
  //   onDragStop,
  //   screenHeight,
  //   screenWidth,
  // } = item;

  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
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
  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
  const isSelected = shapeId === box?.id;

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, trRef, shapeRef]);
  // useEffect(() => {
  //   if (isSelected) {
  //     if (trRef.current && shapeRef.current) {
  //       trRef.current.nodes([shapeRef.current]);
  //       trRef.current?.getLayer()?.batchDraw();
  //     }
  //   }
  // }, [isSelected, trRef, shapeRef]);

  return (
    <>
      {/* <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setBox}
          shape={box}
        />
      </Valid> */}
      <Line
        id={box?.id}
        x={x}
        y={y}
        width={width}
        fillEnabled={true}
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        lineCap={lineCap}
        strokeEnabled={box.strokeWidth > 0}
        dashEnabled={box?.dash > 0}
        lineJoin={lineJoin}
        points={points ?? [5, 70, 140, 23]}
        globalCompositeOperation="source-over"
        shadowEnabled={shadowEnabled ?? true}
        dash={[dash, dash, dash, dash]}
        cornerRadius={
          box?.isAllBorderRadius ? box.bordersRadius : box.borderRadius
        }
        opacity={box?.opacity ?? 1}
        fill={box?.fills?.filter((e) => e?.visible)?.at(0)?.color}
        ref={shapeRef as MutableRefObject<Konva.Line>}
        draggable={shapeId === box?.id}
        stroke={box?.strokes?.filter((e) => e?.visible)?.at(0)?.color}
        strokeWidth={strokeWidth}
        onTap={(e) => {
          setShapeId(box?.id);
        }}
        onClick={() => {
          setShapeId(box?.id);
        }}
        onDragStart={(e) => {
          setBox(ShapeEventDragStart(e));
        }}
        onDragMove={(e) => {
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          );
        }}
        onDragEnd={(e) => {
          setBox(shapeEventDragStop(e));
        }}
        onTransform={(e) => {
          setBox(
            shapeEventDragMove(e, stageDimensions.width, stageDimensions.height)
          );
        }}
        onTransformEnd={(e) => setBox(shapeTransformEnd(e))}
      />
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});
