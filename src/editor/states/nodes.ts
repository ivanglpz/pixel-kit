import { atom } from "jotai";
import { SHAPE_ID_ATOM } from "./shape";
import ALL_SHAPES_ATOM from "./shapes";

export const CHANGE_SHAPE_NODE_ATOM = atom(
  null,
  (get, set, args: { endId: string }) => {
    const shapes = get(ALL_SHAPES_ATOM);
    const startId = get(SHAPE_ID_ATOM);
    const findStart = shapes?.find((e) => e?.id === startId);

    const findEnd = shapes?.find((i) => i?.id === args?.endId);

    if (!findEnd || !findStart) return;

    if (findStart?.id === findEnd?.id) return;
    if (findStart?.id === findEnd?.parentId) return;
    if (findEnd?.tool !== "GROUP") return;

    const shapeEnd = get(findEnd.state);
    const shapeStart = get(findStart.state);

    const relativeX = shapeStart.x - shapeEnd.x;
    const relativeY = shapeStart.y - shapeEnd.y;

    const newState = {
      ...shapeStart,
      parentId: shapeEnd?.id,
      x: relativeX,
      y: relativeY,
    };

    set(findStart?.state, newState);

    set(
      ALL_SHAPES_ATOM,
      shapes?.map((shape) =>
        shape?.id === findStart?.id
          ? { ...shape, parentId: newState?.parentId }
          : shape
      )
    );
  }
);
