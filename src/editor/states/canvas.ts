import { atom } from "jotai";
import { MODE_ATOM } from "./mode";
import { GET_MODE } from "./pages";
import { PROJECT_ATOM } from "./projects";

export const canvasTheme: { [key in "dark" | "light"]: string } = {
  dark: "#242424",
  light: "#dcdce0",
};

const STAGE_CANVAS_BACKGROUND = atom(
  (get) => {
    const PAGES = get(get(GET_MODE).LIST);
    const PAGEID = get(get(GET_MODE).ID);

    const FIND_PAGE = PAGES.find((e) => e?.id === PAGEID);
    if (!FIND_PAGE) {
      throw new Error("STAGE_CANVAS_BACKGROUND: PAGE NOT FOUND");
    }
    return get(FIND_PAGE.color);
  },
  (_get, _set, newTool: string) => {
    const PAGES = _get(_get(PROJECT_ATOM).MODE[_get(MODE_ATOM)].LIST);
    const PAGEID = _get(_get(PROJECT_ATOM).MODE[_get(MODE_ATOM)].ID);

    const FIND_PAGE = PAGES.find((e) => e?.id === PAGEID);
    if (!FIND_PAGE) {
      throw new Error("STAGE_CANVAS_BACKGROUND: PAGE CANVAS NOT FOUND");
    }
    _set(FIND_PAGE.color, newTool);
  }
);
export default STAGE_CANVAS_BACKGROUND;
