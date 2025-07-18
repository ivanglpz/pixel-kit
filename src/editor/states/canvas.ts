import { atom } from "jotai";

export const canvasTheme: { [key in "dark" | "light"]: string } = {
  dark: "#242424",
  light: "#dcdce0",
};

const STAGE_CANVAS_BACKGROUND = atom<string>(canvasTheme.dark);
export default STAGE_CANVAS_BACKGROUND;
