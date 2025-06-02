import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { Shapes } from "../shapes/shapes";
import { FCShapeWEvents } from "../shapes/type.shape";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPES_NODES } from "../states/shapes";

export const LayerPipe = () => {
  const CURRENT_ITEM = useAtomValue(CURRENT_ITEM_ATOM);

  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  if (!CURRENT_ITEM?.id) return null;
  const Component = Shapes?.[CURRENT_ITEM?.tool] as FCShapeWEvents;

  return (
    <>
      <Layer id="layer-pipe-shapes">
        <Component
          item={{
            id: "1",
            childrens: atom<SHAPES_NODES[]>([]),
            state: atom(CURRENT_ITEM),
            tool: CURRENT_ITEM.tool,
          }}
          screenHeight={height}
          screenWidth={width}
          key={`pixel-kit-temporal-shape-${CURRENT_ITEM.id}`}
          shape={atom(CURRENT_ITEM)}
          draggable={false}
          isSelected={CURRENT_ITEM?.tool === "TEXT"}
          onClick={() => {}}
          onDragMove={() => {}}
          onDragStart={() => {}}
          onDragStop={() => {}}
          onTransformStop={() => {}}
        />
      </Layer>
    </>
  );
};
