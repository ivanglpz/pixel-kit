import { atom } from "jotai";
import { IShape } from "../shapes/type.shape";
import { EVENT_ATOM } from "./event";
import { UPDATE_SHAPES_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM from "./shapes";

type Rect = { x: number; y: number; width: number; height: number };

const intersects = (a: IShape, b: Rect) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;
const normalizeRect = (rect: Rect): Rect => {
  const x = rect.width < 0 ? rect.x + rect.width : rect.x;
  const y = rect.height < 0 ? rect.y + rect.height : rect.y;
  const width = Math.abs(rect.width);
  const height = Math.abs(rect.height);
  return { x, y, width, height };
};
export const RECTANGLE_SELECTION_ATOM = atom({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

export const SELECT_AREA_SHAPES_ATOM = atom(null, (get, set) => {
  const SHAPES = get(ALL_SHAPES_ATOM);
  const position = normalizeRect(get(RECTANGLE_SELECTION_ATOM));

  const selected = SHAPES.filter((el) => intersects(get(el.state), position));
  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      selected.map((e) => ({
        id: get(e.state).id,
        parentId: get(e.state).parentId,
      }))
    );
  });
  set(RECTANGLE_SELECTION_ATOM, {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });
  set(EVENT_ATOM, "IDLE");
});
