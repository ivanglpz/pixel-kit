import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useRef } from "react";
import { Rect } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_ID_ATOM } from "../states/shape";
import {
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
} from "./events.shape";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = memo(({ item }: IShapeWithEvents) => {
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
    strokeEnabled,
    dash,
    dashEnabled,
  } = box;

  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();
  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);

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
        draggable={true}
        stroke={stroke}
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
      />
      {/* <Transform isSelected={isSelected} ref={trRef} /> */}
    </>
  );
});

export default ShapeBox;
