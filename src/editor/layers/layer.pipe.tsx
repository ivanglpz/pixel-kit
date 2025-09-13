import { atom, useAtomValue } from "jotai";
import { SHAPES } from "../shapes/shapes";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { ALL_SHAPES } from "../states/shapes";

export const LayerPipe = () => {
  const CURRENT_ITEMS = useAtomValue(CURRENT_ITEM_ATOM);

  if (CURRENT_ITEMS?.length === 0) return null;

  return (
    <>
      {CURRENT_ITEMS?.map((item) => {
        const Component = SHAPES?.[item?.tool];
        if (!Component) {
          return null;
        }
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
