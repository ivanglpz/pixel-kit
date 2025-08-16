import { atom } from "jotai";
import { PROJECT_ATOM } from "./projects";

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

export const imageRenderAtom = atom(
  (get) => get(get(PROJECT_ATOM).IMAGE.RENDER),
  (_get, _set, newTool: IRENDER_IMAGE) => {
    const toolAtom = _get(PROJECT_ATOM).IMAGE.RENDER;
    _set(toolAtom, newTool);
  }
);
export const imageOriginalAtom = atom(
  (get) => get(get(PROJECT_ATOM).IMAGE.ORIGINAL),
  (_get, _set, newTool: IRENDER_IMAGE) => {
    const toolAtom = _get(PROJECT_ATOM).IMAGE.ORIGINAL;
    _set(toolAtom, newTool);
  }
);
