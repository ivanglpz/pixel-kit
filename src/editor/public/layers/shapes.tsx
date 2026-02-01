import { useAtomValue } from "jotai";
import Konva from "konva";
import { useRef } from "react";
import { Layer } from "react-konva";
import { Shapes } from "../../shapes/shapes";
import { IShapeEvents } from "../../shapes/type.shape";
import STAGE_CANVAS_BACKGROUND from "../../states/canvas";
import ALL_SHAPES_ATOM, { ALL_SHAPES } from "../../states/shapes";

type ShapeIteratorProps = {
  item: ALL_SHAPES;
  options: IShapeEvents["options"];
};

const ShapeIterator = ({ item, options }: ShapeIteratorProps) => {
  const shape = useAtomValue(item.state);
  const tool = useAtomValue(shape.tool);

  const Component = Shapes?.[tool];
  return <Component shape={item} options={options} />;
};
export const LayerPublicShapes = () => {
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const lyRef = useRef<Konva.Layer>(null);

  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);

  return (
    <>
      <Layer id="layer-shapes" ref={lyRef}>
        {ALL_SHAPES?.map((item, index) => {
          return (
            <ShapeIterator
              key={`pixel-kit-shapes-${item?.id}-${index}`}
              item={item}
              options={{
                isLocked: true,
                background,
                showLabel: false,
              }}
            />
          );
        })}
      </Layer>
    </>
  );
};
