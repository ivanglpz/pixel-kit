// shape.update.ts
import { ShapeBase } from "./shape.base";

export type ShapeUpdate<K extends keyof ShapeBase> = {
  type: K;
  value: ShapeBase[K];
};

export type ShapeUpdateFn = <K extends keyof ShapeBase>(
  args: ShapeUpdate<K>
) => void;
