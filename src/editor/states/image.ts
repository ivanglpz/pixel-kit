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

export const IMAGE_RENDER_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).IMAGE.RENDER),
  (_get, _set, newTool: IRENDER_IMAGE) => {
    const toolAtom = _get(PROJECT_ATOM).IMAGE.RENDER;
    _set(toolAtom, newTool);
  }
);
export const IMAGE_ORIGINAL_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).IMAGE.ORIGINAL),
  (_get, _set, newTool: IRENDER_IMAGE) => {
    const toolAtom = _get(PROJECT_ATOM).IMAGE.ORIGINAL;
    _set(toolAtom, newTool);
  }
);

export const RESTORE_ORIGINAL_RENDER = atom(null, (get, set) => {
  set(IMAGE_RENDER_ATOM, get(IMAGE_ORIGINAL_ATOM));
});
export const SET_EDIT_IMAGE = atom(null, (get, set, args: IRENDER_IMAGE) => {
  set(IMAGE_ORIGINAL_ATOM, args);

  set(IMAGE_RENDER_ATOM, args);
});
