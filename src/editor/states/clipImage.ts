import { atom } from "jotai";
import { PROJECT_ATOM } from "./projects";

export const showClipAtom = atom(
  (get) => get(get(PROJECT_ATOM).CLIP.SHOW),
  (_get, _set, newTool: boolean) => {
    const toolAtom = _get(PROJECT_ATOM).CLIP.SHOW;
    _set(toolAtom, newTool);
  }
);

export type ICLIP_DIMENSION = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export const boxClipAtom = atom(
  (get) => get(get(PROJECT_ATOM).CLIP.DIMENSION),
  (_get, _set, newTool: ICLIP_DIMENSION) => {
    const toolAtom = _get(PROJECT_ATOM).CLIP.DIMENSION;
    _set(toolAtom, newTool);
  }
);
