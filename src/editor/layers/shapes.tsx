import { Layer } from "react-konva";
import { useSelectedShape, useTool } from "../hooks";
import useShapes from "../hooks/shapes/hook";
import { FCShapeWEvents, IShape } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";

export const LayerShapes = () => {
  const { shapes } = useShapes();
  const { shapeSelected, handleSetShapeSelected } = useSelectedShape();
  const { isMoving } = useTool();

  const onClick = (element: IShape) => {
    handleSetShapeSelected(element);
  };

  return (
    <>
      <Layer>
        {Object.values(shapes)?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          const isSelected = item?.id === shapeSelected?.id;
          return (
            <Component
              key={`pixel-kit-shapes-${item?.id}`}
              shape={item}
              draggable={isMoving}
              isSelected={isSelected}
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
