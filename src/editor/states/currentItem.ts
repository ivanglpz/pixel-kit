import { atom } from "jotai";
import { ShapeState } from "../shapes/types/shape.state";

const CURRENT_ITEM_ATOM = atom<ShapeState[]>([]);

export const CREATE_CURRENT_ITEM_ATOM = atom(
  null,
  (get, set, args: ShapeState[]) => {
    set(CURRENT_ITEM_ATOM, args);
  }
);

export const CLEAR_CURRENT_ITEM_ATOM = atom(null, (get, set) => {
  set(CURRENT_ITEM_ATOM, []);
});
export default CURRENT_ITEM_ATOM;
