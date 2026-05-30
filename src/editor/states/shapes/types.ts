import type { PrimitiveAtom } from "jotai";
import type { ShapeBase } from "../../shapes/types/shape.base";
import type { ShapeState } from "../../shapes/types/shape.state";

export type WithInitialValue<Value> = {
  init: Value;
};

export type ALL_SHAPES = {
  id: string;
  pageId?: string | null;
  state: PrimitiveAtom<ShapeState>;
};

export type SHAPE_BASE_CHILDREN = Omit<ALL_SHAPES, "state"> & {
  state: ShapeBase;
};
