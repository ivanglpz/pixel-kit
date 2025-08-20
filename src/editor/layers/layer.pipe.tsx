import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import CURRENT_ITEM_ATOM from "../states/currentItem";

export const LayerPipe = () => {
  const CURRENT_ITEM = useAtomValue(CURRENT_ITEM_ATOM);

  if (!CURRENT_ITEM?.id) return null;
  const Component = Shapes?.[CURRENT_ITEM?.tool] as FCShapeWEvents;

  return (
    <>
      <Layer id="layer-pipe-shapes">
        <Component
          listShapes={[]}
          shape={{
            id: "1",
            state: atom(CURRENT_ITEM),
            pageId: "main-image-render-stage",
            tool: CURRENT_ITEM.tool,
            parentId: null,
          }}
          key={`pixel-kit-temporal-shape-${CURRENT_ITEM.id}`}
        />
      </Layer>
    </>
  );
};
