import { atom } from "jotai";
import { IShape } from "../shapes/type.shape";

export const showClipAtom = atom(false);

export const boxClipAtom = atom({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as Partial<IShape>);
