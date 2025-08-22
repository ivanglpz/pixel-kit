import { atom } from "jotai";

export const RECTANGLE_SELECTION_ATOM = atom({
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});
