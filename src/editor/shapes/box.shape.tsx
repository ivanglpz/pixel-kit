import Konva from "konva";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { Rect, Transformer } from "react-konva";
import { IShapeWithEvents } from "./type.shape";
import { KonvaEventObject } from "konva/lib/Node";

import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
} from "./events.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = memo((item: IShapeWithEvents) => {
  const {
    draggable,
    isSelected,
    onClick,
    onDragMove,
    onDragStart,
    onDragStop,
  } = item;

  const [box, setBox] = useState(() => {
    return item.shape;
  });

  const {
    width,
    height,
    resolution,
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
  } = box;

  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();

  const shapeTransformEnd = (evt: KonvaEventObject<Event>) => {
    setBox((prev) => {
      if (shapeRef?.current) {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        const payload = {
          ...prev,
          x: node.x(),
          y: node.y(),
          rotate,
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
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
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        cornerRadius={borderRadius}
        fill={backgroundColor}
        ref={shapeRef as MutableRefObject<Konva.Rect>}
        draggable={draggable}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onClick={(e) => setBox(shapeEventClick(e, onClick))}
        onDragStart={(e) => setBox(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) => setBox(shapeEventDragMove(e, onDragMove))}
        onDragEnd={(e) => setBox(shapeEventDragStop(e, onDragStop))}
        onTransformEnd={shapeTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef as MutableRefObject<Konva.Transformer>}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
});

export const isPartialBorderRadius = (item: IShapeWithEvents) => {
  return {
    cornerRadius: [],
  };
};

export default ShapeBox;
