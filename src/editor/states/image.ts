import { atom } from "jotai";

export const initialRenderImage = {
  base64: "",
  x: 0,
  y: 0,
  width: 0,
  name: "",
  height: 0,
};

export const imageRenderAtom = atom(initialRenderImage);
export const imageOriginalAtom = atom<typeof initialRenderImage | null>(null);
