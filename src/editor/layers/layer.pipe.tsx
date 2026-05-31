import { atom, useAtomValue } from "jotai";
import { constants } from "../constants/color";
import { ShapeState } from "../shapes/types/shape.state";
import CURRENT_ITEM_ATOM from "../states/currentItem";
import { ALL_SHAPES } from "../states/shapes/types";
import { ShapeIterator } from "./layer.shapes";

type PipeShapeProps = {
  item: ShapeState;
};

const PipeShape = ({ item }: PipeShapeProps) => {
  return (
    <ShapeIterator
      item={{
        id: item.id,
        state: atom({
          ...item,
          children: item.children ? item.children : atom([] as ALL_SHAPES[]),
        }),
      }}
      options={{
        isLocked: true,
        background: constants.theme.colors.black,
        showIdentifier: true,
      }}
    />
  );
};

export const LayerPipe = () => {
  const currentItems = useAtomValue(CURRENT_ITEM_ATOM);
  if (currentItems.length === 0) return null;

  return (
    <div id="layer-pipe-shapes" style={{ position: "absolute", inset: 0 }}>
      {currentItems.map((item) => (
        <PipeShape key={item.id} item={item} />
      ))}
    </div>
  );
};
