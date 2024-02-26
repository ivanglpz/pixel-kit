/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { memo } from "react";
import { Layer } from "react-konva";
import { useSelectedShape, useTool } from "../hooks";
import useShapes from "../hooks/shapes/hook";
import { IKeyTool } from "../hooks/tool/types";
import { FCShapeWEvents, IShape } from "./type";
import PixelTemporalShape from "./temporalShape";
import { ShapesWithKeysMethods } from "./shapesWithKeysMethods";

const PixelKitShapes = memo(() => {
  const { shapes } = useShapes();
  const { shapeSelected, handleSetShapeSelected } = useSelectedShape();
  const { isMoving } = useTool();

  const onClick = (element: IShape) => {};

  return (
    <>
      <Layer>
        {Object.values(shapes)?.map((item) => {
          const Component = ShapesWithKeysMethods?.[
            `${item?.tool}` as IKeyTool
          ] as FCShapeWEvents;
          const isSelected = item?.id === shapeSelected?.id;
          return (
            <Component
              key={`pixel-kit-shapes-${item?.id}`}
              shape={item}
              draggable={isMoving}
              isSelected={true}
              onClick={onClick}
              onDragStart={() => {}}
              onDragMove={() => {}}
              onDragStop={() => {}}
              onTransformStop={() => {}}
            />
          );
        })}
      </Layer>
      <PixelTemporalShape />
    </>
  );
});

export default PixelKitShapes;
