import { atom, PrimitiveAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IShape } from "../shapes/type.shape";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageJSON, IPageShapeIds } from "./pages";
import { ALL_SHAPES, ALL_SHAPES_CHILDREN, WithInitialValue } from "./shapes";
import { TABS_PERSIST_ATOM } from "./tabs";
import { IKeyTool } from "./tool";
import { UndoRedoAction } from "./undo-redo";

export type IEDITORPROJECT = {
  ID: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  MODE_ATOM: PrimitiveAtom<MODE> & WithInitialValue<MODE>;
  TOOL: PrimitiveAtom<IKeyTool> & WithInitialValue<IKeyTool>;
  PAUSE_MODE: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  MODE: {
    [key in MODE]: {
      LIST: PrimitiveAtom<IPage[]> & WithInitialValue<IPage[]>;
      ID: PrimitiveAtom<string> & WithInitialValue<string>;
    };
  };

  EVENT: PrimitiveAtom<IStageEvents> & WithInitialValue<IStageEvents>;
};

export const PROJECT_ID_ATOM = atomWithStorage<string | null>("pageId", null);

const cloneShapeRecursive = (shape: ALL_SHAPES_CHILDREN): ALL_SHAPES => {
  return {
    id: shape.id,
    pageId: shape.pageId,
    tool: shape.tool,
    state: atom<IShape>({
      ...shape.state,
      children: atom(shape.state.children.map((c) => cloneShapeRecursive(c))),
    }),
  };
};

export const MOCKUP_PROJECT: IEDITORPROJECT = {
  ID: "mockup-id",
  EVENT: atom<IStageEvents>("IDLE"),
  TOOL: atom<IKeyTool>("MOVE"),
  PAUSE_MODE: atom<boolean>(false),
  name: atom<string>("mockup-project-name"),
  MODE_ATOM: atom<MODE>("DESIGN_MODE"),
  MODE: {
    DESIGN_MODE: {
      LIST: atom([
        {
          id: "mockup-page-one",
          color: atom("black"),
          isVisible: atom(true),
          name: atom("Project One"),
          SHAPES: {
            ID: atom<IPageShapeIds[]>([]),
            LIST: atom<ALL_SHAPES[]>([]),
          },
          UNDOREDO: {
            COUNT_UNDO_REDO: atom<number>(0),
            LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
          },
        },
      ] as IPage[]),
      ID: atom<string>("mockup-page-one"),
    },
  },
};
export const PROJECTS_ATOM = atom((get) => {
  const PERSIST = get(TABS_PERSIST_ATOM);
  return PERSIST?.map((project) => {
    const DATA = JSON.parse(project.data);
    const LIST_PAGES = DATA[project.mode]?.LIST as IPageJSON[];

    const FIRST_PAGE = LIST_PAGES.at(0);

    return {
      ID: project._id,
      name: atom(project.name),
      MODE_ATOM: atom<MODE>(project.mode),
      TOOL: atom<IKeyTool>("MOVE"),

      PAUSE_MODE: atom<boolean>(false),
      MODE: {
        [project.mode]: {
          LIST: atom(
            LIST_PAGES?.map((page) => {
              const LIST = page?.SHAPES?.LIST?.map((e) =>
                cloneShapeRecursive(e)
              );
              return {
                id: page.id,
                name: atom(page.name),
                color: atom(page.color),
                isVisible: atom(page.isVisible),
                SHAPES: {
                  ID: atom<IPageShapeIds[]>([]),
                  LIST: atom<ALL_SHAPES[]>(LIST),
                },
                UNDOREDO: {
                  COUNT_UNDO_REDO: atom<number>(0),
                  LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
                },
              };
            })
          ),
          ID: atom<string>(FIRST_PAGE?.id ?? ""),
        },
      },

      EVENT: atom<IStageEvents>("IDLE"),
    };
  });
});

export const PROJECT_ATOM = atom((get) => {
  const PROJECT_ID = get(PROJECT_ID_ATOM);
  const PROJECTS = get(PROJECTS_ATOM);
  const FIND_PROJECT = PROJECTS?.find((p) => p?.ID === PROJECT_ID);
  // if (!FIND_PROJECT) {
  //   throw new Error("PROJECT NOT FOUND");
  // }

  return FIND_PROJECT ?? MOCKUP_PROJECT;
});

export const DELETE_PROJECT = atom(null, (get, set, id: string) => {
  const PROJECTS = get(TABS_PERSIST_ATOM);
  const currentIndex = PROJECTS.findIndex((e) => e._id === id);
  const newList = PROJECTS.filter((e) => e._id !== id);

  const nextIndex =
    currentIndex < newList.length ? currentIndex : newList.length - 1;

  const PAGE_ID = newList?.at?.(nextIndex)?._id;

  if (!PAGE_ID) {
    set(TABS_PERSIST_ATOM, []);
    set(PROJECT_ID_ATOM, null);

    return;
  }

  set(PROJECT_ID_ATOM, PAGE_ID);
  set(TABS_PERSIST_ATOM, newList);
});
