import { Layer } from "react-konva";
import { useSelectedShape, useTool } from "../hooks";
import useShapes from "../hooks/useShapes";
import { FCShapeWEvents, IShape } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";
import { useAtomValue } from "jotai";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";

export const LayerShapes = () => {
  const { shapes } = useShapes();
  const { shapeSelected, handleSetShapeSelected } = useSelectedShape();
  const { isDrawing } = useTool();

  const onClick = (element: IShape) => {
    handleSetShapeSelected(element);
  };

  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  return (
    <>
      <Layer id="layer-shapes">
        {Object.values(shapes)?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          const isSelected = item?.id === shapeSelected?.id;
          return (
            <Component
              screenHeight={height}
              screenWidth={width}
              key={`pixel-kit-shapes-${item?.id}`}
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
      </Layer>
    </>
  );
};
