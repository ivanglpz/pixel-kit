import { useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import SHAPES_ATOM from "../states/shapes";

export const LayerShapes = () => {
  // const { isDrawing } = useTool();

  // const onClick = (element: IShape) => {
  //   handleSetShapeSelected(element);
  // };

  const SHAPES = useAtomValue(SHAPES_ATOM);

  return (
    <>
      <Layer id="layer-shapes">
        {SHAPES?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return <Component item={item} key={`pixel-kit-shapes-${item?.id}`} />;
        })}
      </Layer>
    </>
  );
};
