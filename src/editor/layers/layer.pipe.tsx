import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { ShapeState } from "../shapes/types/shape.state";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { ALL_SHAPES } from "../states/shapes";

type ShapeIteratorProps = {
  item: ShapeState;
  index: number;
  id: string;
};

const ShapeIterator = ({ item, index, id }: ShapeIteratorProps) => {
  const tool = useAtomValue(item.tool);

  const Component = Shapes?.[tool];
  return (
    <Component
      shape={{
        id: "1",
        state: atom({
          ...item,
          children: item.children ? item.children : atom([] as ALL_SHAPES[]),
        }),
        // pageId: "main-image-render-stage",
        // tool: item.tool,
      }}
      key={`${id}-${item?.id}-${index}`}
    />
  );
};
export const LayerPipe = () => {
  const CURRENT_ITEMS = useAtomValue(CURRENT_ITEM_ATOM);

  if (CURRENT_ITEMS?.length === 0) return null;

  return (
    <>
      <Layer id="layer-pipe-shapes">
        {CURRENT_ITEMS?.map((item, index) => {
          return (
            <ShapeIterator
              id="pixel-kit-temporal-shape"
              item={item}
              index={index}
            />
          );

          // const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          // <Component
          //   shape={{
          //     id: "1",
          //     state: atom({
          //       ...item,
          //       children: item.children
          //         ? item.children
          //         : atom([] as ALL_SHAPES[]),
          //     }),
          //     // pageId: "main-image-render-stage",
          //     tool: item.tool,
          //   }}
          //   key={`pixel-kit-temporal-shape-${item.id}`}
          // />
        })}
      </Layer>
    </>
  );
};
