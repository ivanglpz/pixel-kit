import Konva from "konva";
import { Group } from "konva/lib/Group";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";

const stageAbsolutePosition = (event: KonvaEventObject<MouseEvent>) => {
  // the function will return pointer position relative to the passed node
  const node = event?.target?.getStage?.() as Konva.Stage;
  const transform = node?.getAbsoluteTransform()?.copy?.();
  // to detect relative position we need to invert transform
  transform?.invert?.();

  // get pointer (say mouse or touch) position
  const pos = node?.getStage()?.getPointerPosition?.() as Vector2d;

  // now we find a relative point
  return transform?.point?.(pos);
};
const groupAbsolutePosition = (
  node: Group,
): {
  x: number;
  y: number;
} => {
  // the function will return pointer position relative to the passed node
  const transform = node?.getAbsoluteTransform()?.copy?.();
  // to detect relative position we need to invert transform
  transform?.invert?.();

  // get pointer (say mouse or touch) position
  const pos = node?.getStage()?.getPointerPosition?.() as Vector2d;

  // now we find a relative point
  return transform?.point?.(pos);
};
export default stageAbsolutePosition;
