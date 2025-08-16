import { atom } from "jotai";

export type IRENDER_IMAGE = {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  base64: string;
};
export const INITIAL_RENDER_IMAGE = {
  base64: "",
  x: 0,
  y: 0,
  width: 0,
  name: "",
  height: 0,
};

export const imageRenderAtom = atom(INITIAL_RENDER_IMAGE);
export const imageOriginalAtom = atom<typeof INITIAL_RENDER_IMAGE | null>(null);
