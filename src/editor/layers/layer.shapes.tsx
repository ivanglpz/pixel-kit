import { useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import ALL_SHAPES_ATOM, { ROOT_SHAPES_ATOM } from "../states/shapes";

export const LayerShapes = () => {
  // const { isDrawing } = useTool();

  // const onClick = (element: IShape) => {
  //   handleSetShapeSelected(element);
  // };

  const ROOT_SHAPES = useAtomValue(ROOT_SHAPES_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  return (
    <>
      <Layer id="layer-shapes">
        {ROOT_SHAPES?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              SHAPES={ALL_SHAPES}
              item={item}
              key={`pixel-kit-shapes-${item?.id}`}
            />
          );
        })}
      </Layer>
    </>
  );
};
