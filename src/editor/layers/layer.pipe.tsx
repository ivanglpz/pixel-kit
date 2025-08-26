import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import CURRENT_ITEM_ATOM from "../states/currentItem";

export const LayerPipe = () => {
  const CURRENT_ITEMS = useAtomValue(CURRENT_ITEM_ATOM);

  if (CURRENT_ITEMS?.length === 0) return null;

  return (
    <>
      <Layer id="layer-pipe-shapes">
        {CURRENT_ITEMS?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              layoutShapes={[]}
              shape={{
                id: "1",
                state: atom(item),
                pageId: "main-image-render-stage",
                tool: item.tool,
                parentId: null,
              }}
              key={`pixel-kit-temporal-shape-${item.id}`}
            />
          );
        })}
      </Layer>
    </>
  );
};
