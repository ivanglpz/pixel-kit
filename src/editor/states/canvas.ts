import { atom } from "jotai";
import { CURRENT_PAGE } from "./pages";

export const canvasTheme: { [key in "dark" | "light"]: string } = {
  dark: "#242424",
  light: "#dcdce0",
};

const STAGE_CANVAS_BACKGROUND = atom(
  (get) => {
    return get(get(CURRENT_PAGE).color);
  },
  (_get, _set, newTool: string) => {
    _set(_get(CURRENT_PAGE).color, newTool);
  }
);
export default STAGE_CANVAS_BACKGROUND;
