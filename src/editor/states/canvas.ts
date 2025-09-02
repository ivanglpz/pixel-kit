import { atom } from "jotai";
import { PAGE_BY_MODE } from "./pages";

export const canvasTheme: { [key in "dark" | "light"]: string } = {
  dark: "#242424",
  light: "#dcdce0",
};

const STAGE_CANVAS_BACKGROUND = atom(
  (get) => {
    return get(get(PAGE_BY_MODE).color);
  },
  (_get, _set, newTool: string) => {
    _set(_get(PAGE_BY_MODE).color, newTool);
  }
);
export default STAGE_CANVAS_BACKGROUND;
