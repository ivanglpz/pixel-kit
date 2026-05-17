import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { IShapeEvents } from "../shapes/type.shape";
import { ShapeState } from "../shapes/types/shape.state";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { ALL_SHAPES } from "../states/shapes";

type ShapeIteratorProps = {
  item: ShapeState;
  options: IShapeEvents["options"];
};

const ShapeIterator = ({ item, options }: ShapeIteratorProps) => {
  const tool = useAtomValue(item.tool);

  const Component = Shapes?.[tool];
  return (
    <Component
      options={options}
      shape={{
        id: "1",
        state: atom({
          ...item,
          children: item.children ? item.children : atom([] as ALL_SHAPES[]),
        }),
      }}
    />
  );
};
export const LayerPipe = () => {
  const CURRENT_ITEMS = useAtomValue(CURRENT_ITEM_ATOM);
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);

  if (CURRENT_ITEMS?.length === 0) return null;

  return (
    <>
      <Layer id="layer-pipe-shapes">
        {CURRENT_ITEMS?.map((item, index) => {
          return (
            <ShapeIterator
              key={`pixel-kit-temporal-shape-${item?.id}-${index}`}
              item={item}
              options={{
                isLocked: false,
                background,
                showLabel: true,
              }}
            />
          );
        })}
      </Layer>
    </>
  );
};
