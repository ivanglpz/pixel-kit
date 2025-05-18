import Konva from "konva";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { Group, Rect } from "react-konva";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";
import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
  shapeTransformEnd,
} from "./events.shape";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { Shapes } from "./shapes";
import { useSelectedShape, useTool } from "../hooks";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { Valid } from "@/components/valid";
import { Transform } from "./transformer";

// eslint-disable-next-line react/display-name
export const ShapeGroup = memo((event: IShapeWithEvents) => {
  const {
    draggable,
    isSelected,
    onClick,
    onDragMove,
    onDragStart,
    onDragStop,
    screenHeight,
    screenWidth,
  } = event;

  const [box, setBox] = useAtom(
    event.shape as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const {
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
    height,
    width,
  } = box;

  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();
  const { shapeSelected } = useSelectedShape();
  const { isDrawing } = useTool();
  const stage = useAtomValue(STAGE_DIMENSION_ATOM);
  const [childrens] = useAtom(event.item.childrens);

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
      <Rect
        id={box?.id}
        x={x}
        y={y}
        width={width}
        height={height}
        fillEnabled={fillEnabled ?? true}
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
      <Group x={x} y={y} width={width} height={height}>
        {childrens?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          const isSelected = item?.id === shapeSelected?.id;
          return (
            <Component
              item={item}
              screenHeight={stage.height}
              screenWidth={stage.width}
              key={`pixel-group-shapes-${item?.id}-${item.tool}`}
              shape={item?.state}
              draggable={!isDrawing && isSelected}
              isSelected={!isDrawing && isSelected}
              onClick={onClick}
              onDragStart={() => {}}
              onDragMove={() => {}}
              onDragStop={() => {}}
              onTransformStop={() => {}}
            />
          );
        })}
      </Group>
      <Transform isSelected={isSelected} ref={trRef} />
    </>
  );
});
