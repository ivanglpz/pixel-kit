import { atom } from "jotai";
import { PROJECT_ATOM } from "./projects";

export const canvasTheme: { [key in "dark" | "light"]: string } = {
  dark: "#242424",
  light: "#dcdce0",
};

const STAGE_CANVAS_BACKGROUND = atom(
  (get) => get(get(PROJECT_ATOM).CANVAS_BG),
  (_get, _set, newTool: string) => {
    const toolAtom = _get(PROJECT_ATOM).CANVAS_BG;
    _set(toolAtom, newTool);
  }
);
export default STAGE_CANVAS_BACKGROUND;
