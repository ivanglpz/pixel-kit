import { atom, useAtomValue } from "jotai";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { ALL_SHAPES } from "../states/shapes";

export const LayerPipe = () => {
  const CURRENT_ITEMS = useAtomValue(CURRENT_ITEM_ATOM);

  if (CURRENT_ITEMS?.length === 0) return null;

  return (
    <>
      {CURRENT_ITEMS?.map((item) => {
        const Component = Shapes?.[item?.tool] as FCShapeWEvents;
        return (
          <Component
            shape={{
              id: "1",
              state: atom({
                ...item,
                children: item?.children
                  ? item.children
                  : atom<ALL_SHAPES[]>([]),
              }),
              pageId: "main-image-render-stage",
              tool: item.tool,
            }}
            key={`pixel-kit-temporal-shape-${item.id}`}
          />
        );
      })}
    </>
  );
};
