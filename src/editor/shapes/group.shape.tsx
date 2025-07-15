import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { memo, useRef } from "react";
import { Group } from "react-konva";
import { useTool } from "../hooks";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import ShapeBox from "./box.shape";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";

// eslint-disable-next-line react/display-name
export const ShapeGroup = memo(({ item }: IShapeWithEvents) => {
  // const {
  //   draggable,
  //   isSelected,
  //   onClick,
  //   onDragMove,
  //   onDragStart,
  //   onDragStop,
  //   screenHeight,
  //   screenWidth,
  // } = event;

  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
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
  const { isDrawing } = useTool();
  const stage = useAtomValue(STAGE_DIMENSION_ATOM);
  const [childrens] = useAtom(item.childrens);

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
      <ShapeBox item={item} />

      <Group x={x} y={y} width={width} height={height}>
        {childrens?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              item={item}
              // screenHeight={stage.height}
              // screenWidth={stage.width}
              key={`pixel-group-shapes-${item?.id}-${item.tool}`}
              // shape={item?.state}
              // draggable={!isDrawing && isSelected}
              // isSelected={!isDrawing && isSelected}
              // onClick={onClick}
              // onDragStart={() => {}}
              // onDragMove={() => {}}
              // onDragStop={() => {}}
              // onTransformStop={() => {}}
            />
          );
        })}
      </Group>
      {/* <Transform isSelected={isSelected} ref={trRef} /> */}
    </>
  );
});
