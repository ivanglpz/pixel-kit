import { atom } from "jotai";
import { IShape } from "../shapes/type.shape";
import { EVENT_ATOM } from "./event";
import { UPDATE_SHAPES_IDS_ATOM } from "./shape";
import { PLANE_SHAPES_ATOM } from "./shapes";

type Rect = { x: number; y: number; width: number; height: number };

const intersects = (a: IShape, b: Rect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const RECTANGLE_SELECTION_ATOM = atom({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

export const SELECT_AREA_SHAPES_ATOM = atom(null, (get, set) => {
  const PLANE_SHAPES = get(PLANE_SHAPES_ATOM);
  const position = get(RECTANGLE_SELECTION_ATOM);
  const selected = PLANE_SHAPES.filter((el) =>
    intersects(get(el.state), position)
  );

  setTimeout(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      selected.map((e) => ({
        id: get(e.state).id,
        parentId: get(e.state).parentId,
      }))
    );
  }, 1);
  set(RECTANGLE_SELECTION_ATOM, {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  set(EVENT_ATOM, "IDLE");
});
