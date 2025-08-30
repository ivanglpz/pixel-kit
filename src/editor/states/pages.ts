import { atom, PrimitiveAtom } from "jotai";
import { MODE, MODE_ATOM } from "../hooks/useConfiguration";
import { IShape } from "../shapes/type.shape";
import { canvasTheme } from "./canvas";
import { PROJECT_ATOM } from "./projects";
import { ALL_SHAPES, WithInitialValue } from "./shapes";
import { UNDO_REDO_PROPS } from "./undo-redo";

export type IPageShapeIds = Pick<IShape, "id" | "parentId">;

export type IPage = {
  id: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  color: PrimitiveAtom<string> & WithInitialValue<string>;
  isVisible: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  type: MODE;
  SHAPE: {
    LIST: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
    ID: PrimitiveAtom<IPageShapeIds[]> & WithInitialValue<IPageShapeIds[]>;
  };
  UNDOREDO: {
    COUNT_UNDO_REDO: PrimitiveAtom<number> & WithInitialValue<number>;
    LIST_UNDO_REDO: PrimitiveAtom<UNDO_REDO_PROPS[]> &
      WithInitialValue<UNDO_REDO_PROPS[]>;
  };
};
export const PAGES_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).MODE[get(MODE_ATOM)].LIST),
  (_get, _set, newTool: IPage[]) => {
    const toolAtom = _get(PROJECT_ATOM).MODE[_get(MODE_ATOM)].LIST;
    _set(toolAtom, newTool);
  }
);

export const PAGE_ID_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).MODE[get(MODE_ATOM)].ID),
  (_get, _set, newTool: string) => {
    const toolAtom = _get(PROJECT_ATOM).MODE[_get(MODE_ATOM)].ID;
    _set(toolAtom, newTool);
  }
);

export const RESET_PAGE_ID_ATOM = atom(null, (get, set) => {
  const mode = get(MODE_ATOM);
  const pages = get(PAGES_ATOM);
  const page = pages.find((p) => p.type === mode);
  if (!page) {
    throw new Error(`No page found for mode: ${mode}`);
  }
  set(PAGE_ID_ATOM, page.id);
});

export const PAGES_BY_TYPE_ATOM = atom((get) => {
  const mode = get(MODE_ATOM);
  const pages = get(PAGES_ATOM);
  return pages.filter((p) => p.type === mode);
});

export const NEW_PAGE = atom(null, (get, set) => {
  const mode = get(MODE_ATOM);

  const pages = get(PAGES_ATOM);
  const pagesByType = pages.filter((p) => p.type === mode);
  const newPage: IPage = {
    id: crypto.randomUUID(),
    name: atom(`Page ${pagesByType.length + 1}`),
    color: atom(canvasTheme.dark),
    isVisible: atom(true),
    type: mode,
    SHAPE: {
      ID: atom<IPageShapeIds[]>([]),
      LIST: atom<ALL_SHAPES[]>([]),
    },
    UNDOREDO: {
      COUNT_UNDO_REDO: atom<number>(0),
      LIST_UNDO_REDO: atom<UNDO_REDO_PROPS[]>([]),
    },
  };
  set(PAGE_ID_ATOM, newPage.id);
  set(PAGES_ATOM, [...pages, newPage]);
});

export const DELETE_PAGE = atom(null, (get, set, id: string) => {
  const pages = get(PAGES_ATOM);
  if (pages.length === 1) return; // at least one page
  set(
    PAGES_ATOM,
    pages.filter((p) => p.id !== id)
  );
});
