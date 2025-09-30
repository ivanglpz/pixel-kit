import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { IShape } from "../shapes/type.shape";
import { canvasTheme } from "./canvas";
import { MODE_ATOM } from "./mode";
import { PROJECT_ATOM } from "./projects";
import { ALL_SHAPES, ALL_SHAPES_CHILDREN, WithInitialValue } from "./shapes";
import { UndoRedoAction } from "./undo-redo";

export type IPageShapeIds = Pick<IShape, "id" | "parentId">;

export type IPage = {
  id: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  color: PrimitiveAtom<string> & WithInitialValue<string>;
  isVisible: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  SHAPES: {
    LIST: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
    ID: PrimitiveAtom<IPageShapeIds[]> & WithInitialValue<IPageShapeIds[]>;
  };
  UNDOREDO: {
    COUNT_UNDO_REDO: PrimitiveAtom<number> & WithInitialValue<number>;
    LIST_UNDO_REDO: PrimitiveAtom<UndoRedoAction[]> &
      WithInitialValue<UndoRedoAction[]>;
  };
};

export type IPageJSON = {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  SHAPES: {
    LIST: ALL_SHAPES_CHILDREN[];
  };
};
export const GET_MODE = atom((get) => {
  return get(PROJECT_ATOM).MODE[get(MODE_ATOM)];
});
export const CURRENT_PAGE = atom((get) => {
  const PAGES = get(get(GET_MODE).LIST);
  const PAGEID = get(get(GET_MODE).ID);

  const FIND_PAGE = PAGES.find((e) => e?.id === PAGEID);
  if (!FIND_PAGE) {
    throw new Error("PROJECT_BY_MODE: PAGE NOT FOUND");
  }
  return FIND_PAGE;
});

export const PAGES_ATOM = atom(
  (get) => {
    return get(get(GET_MODE).LIST);
  },
  (_get, _set, newTool: IPage[]) => {
    const toolAtom = _get(GET_MODE).LIST;
    _set(toolAtom, newTool);
  }
);

export const PAGE_ID_ATOM = atom(
  (get) => get(get(GET_MODE).ID),
  (_get, _set, newTool: string) => {
    const toolAtom = _get(GET_MODE).ID;
    _set(toolAtom, newTool);
  }
);

export const RESET_PAGE_ID_ATOM = atom(null, (get, set) => {
  const pages = get(PAGES_ATOM);
  const page = pages?.at?.(0);
  if (!page) {
    throw new Error("PAGE_RESET_NOT_FOUND");
  }

  set(PAGE_ID_ATOM, page.id);
});

export const PAGES_BY_TYPE_ATOM = atom((get) => {
  const pages = get(PAGES_ATOM);
  return pages;
});

export const NEW_PAGE = atom(null, (get, set) => {
  const pages = get(PAGES_ATOM);
  // const pagesByType = pages.filter((p) => p.type === mode);
  const newPage: IPage = {
    id: uuidv4(),
    name: atom(`Page ${pages.length + 1}`),
    color: atom(canvasTheme.dark),
    isVisible: atom(true),
    SHAPES: {
      ID: atom<IPageShapeIds[]>([]),
      LIST: atom<ALL_SHAPES[]>([]),
    },
    UNDOREDO: {
      COUNT_UNDO_REDO: atom<number>(0),
      LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
    },
  };
  set(PAGE_ID_ATOM, newPage.id);
  set(PAGES_ATOM, [...pages, newPage]);
});

export const DELETE_PAGE = atom(null, (get, set, id: string) => {
  const pages = get(PAGES_ATOM);
  const newPages = pages.filter((p) => p.id !== id);
  if (newPages.length === 0) return; // at least one page

  set(get(GET_MODE).ID, newPages.at(0)?.id ?? null);
  set(PAGES_ATOM, newPages);
});
