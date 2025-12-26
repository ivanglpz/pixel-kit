import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { canvasTheme } from "./canvas";
import { MODE_ATOM } from "./mode";
import { PROJECT_ATOM } from "./projects";
import { ALL_SHAPES, SHAPE_BASE_CHILDREN, WithInitialValue } from "./shapes";
import { UndoRedoAction } from "./undo-redo";

export type IShapeId = { id: string; parentId: string | null };

type Position = {
  x: number;
  y: number;
};
export type IPageState = {
  id: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  color: PrimitiveAtom<string> & WithInitialValue<string>;
  isVisible: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  VIEWPORT: {
    SCALE: PrimitiveAtom<Position> & WithInitialValue<Position>;
    POSITION: PrimitiveAtom<Position> & WithInitialValue<Position>;
  };
  SHAPES: {
    LIST: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
    ID: PrimitiveAtom<IShapeId[]> & WithInitialValue<IShapeId[]>;
  };
  UNDOREDO: {
    COUNT_UNDO_REDO: PrimitiveAtom<number> & WithInitialValue<number>;
    LIST_UNDO_REDO: PrimitiveAtom<UndoRedoAction[]> &
      WithInitialValue<UndoRedoAction[]>;
  };
};

export type IPageBase = {
  id: string;
  name: string;
  color: string;
  isVisible: boolean;
  SHAPES: {
    LIST: SHAPE_BASE_CHILDREN[];
  };
  VIEWPORT: {
    SCALE: Position;
    POSITION: Position;
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
  (_get, _set, newTool: IPageState[]) => {
    const toolAtom = _get(GET_MODE).LIST;
    _set(toolAtom, newTool);
  }
);

export const POSITION_SCALE_ATOM = atom(
  (get) => {
    const CURRENT = get(CURRENT_PAGE);
    return get(CURRENT.VIEWPORT.SCALE);
  },
  (get, set, newPosition: Position) => {
    const CURRENT = get(CURRENT_PAGE);
    set(CURRENT.VIEWPORT.SCALE, newPosition);
  }
);
export const POSITION_PAGE_ATOM = atom(
  (get) => {
    const CURRENT = get(CURRENT_PAGE);
    return get(CURRENT.VIEWPORT.POSITION);
  },
  (get, set, newPosition: Position | ((prev: Position) => Position)) => {
    const CURRENT = get(CURRENT_PAGE);
    if (typeof newPosition === "function") {
      const prev = get(CURRENT.VIEWPORT.POSITION);
      newPosition = newPosition(prev);
    }
    set(CURRENT.VIEWPORT.POSITION, newPosition);
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
  const newPage: IPageState = {
    id: uuidv4(),
    name: atom(`Page ${pages.length + 1}`),
    color: atom(canvasTheme.dark),
    VIEWPORT: {
      SCALE: atom({ x: 1, y: 1 }),
      POSITION: atom({ x: 0, y: 0 }),
    },
    isVisible: atom(true),
    SHAPES: {
      ID: atom<IShapeId[]>([]),
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
