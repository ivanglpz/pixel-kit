import { IShape } from "@/editor/shapes/type.shape";
import { atom } from "jotai";

const CURRENT_ITEM_ATOM = atom<IShape | null>(null);

export const CREATE_CURRENT_ITEM_ATOM = atom(null, (get, set, args: IShape) => {
  set(CURRENT_ITEM_ATOM, args);
});

export const CLEAR_CURRENT_ITEM_ATOM = atom(null, (get, set) => {
  set(CURRENT_ITEM_ATOM, null);
});
export default CURRENT_ITEM_ATOM;
