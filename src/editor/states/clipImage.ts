import { atom } from "jotai";

export const showClipAtom = atom(false);

export type ICLIP_DIMENSION = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export const boxClipAtom = atom({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
} as ICLIP_DIMENSION);
