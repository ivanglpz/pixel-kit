import { useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import SHAPES_ATOM, { SHAPES_NO_PARENTS_ATOM } from "../states/shapes";

export const LayerShapes = () => {
  // const { isDrawing } = useTool();

  // const onClick = (element: IShape) => {
  //   handleSetShapeSelected(element);
  // };

  const SHAPES_NOPARENTS = useAtomValue(SHAPES_NO_PARENTS_ATOM);
  const SHAPES = useAtomValue(SHAPES_ATOM);
  return (
    <>
      <Layer id="layer-shapes">
        {SHAPES_NOPARENTS?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              SHAPES={SHAPES}
              item={item}
              key={`pixel-kit-shapes-${item?.id}`}
            />
          );
        })}
      </Layer>
    </>
  );
};
