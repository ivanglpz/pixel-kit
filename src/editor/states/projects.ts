import { IProject } from "@/db/schemas/types";
import { atom, PrimitiveAtom } from "jotai";
import { IShape } from "../shapes/type.shape";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageJSON, IPageShapeIds } from "./pages";
import { ALL_SHAPES, ALL_SHAPES_CHILDREN, WithInitialValue } from "./shapes";
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

export const PROJECT_ID_ATOM = atom<string | null>(null);

export const PROJECTS_ATOM = atom([] as IEDITORPROJECT[]);

export const PROJECT_ATOM = atom((get) => {
  const PROJECT_ID = get(PROJECT_ID_ATOM);
  const PROJECTS = get(PROJECTS_ATOM);
  const FIND_PROJECT = PROJECTS?.find((p) => p?.ID === PROJECT_ID);
  if (!FIND_PROJECT) {
    throw new Error("PROJECT NOT FOUND");
  }

  return FIND_PROJECT;
});

export const ADD_PROJECT = atom(null, (get, set, args: IProject) => {
  const findProjet = get(PROJECTS_ATOM).some((e) => e.ID === args?._id);
  if (findProjet) return;
  const DATA = JSON.parse(args.data);
  const LIST_PAGES = DATA[args.mode]?.LIST as IPageJSON[];
  const FIRST_PAGE = LIST_PAGES.at(0);
  if (!FIRST_PAGE) {
    return;
  }

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

  set(PROJECTS_ATOM, [
    ...get(PROJECTS_ATOM),
    {
      ID: args._id,
      name: atom(args.name),
      MODE_ATOM: atom<MODE>(args.mode),
      TOOL: atom<IKeyTool>("MOVE"),

      PAUSE_MODE: atom<boolean>(false),
      MODE: {
        [args.mode]: {
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
          ID: atom<string>(FIRST_PAGE.id),
        },
      },

      EVENT: atom<IStageEvents>("IDLE"),
    },
  ]);
  // set(PROJECT_ID_ATOM, args?._id);
});

export const DELETE_PROJECT = atom(null, (get, set, id: string) => {
  const PROJECTS = get(PROJECTS_ATOM);
  const currentIndex = PROJECTS.findIndex((e) => e.ID === id);
  const newList = PROJECTS.filter((e) => e.ID !== id);

  if (currentIndex === -1) return;

  const nextIndex =
    currentIndex < newList.length ? currentIndex : newList.length - 1;

  const PAGE_ID = newList?.at?.(nextIndex)?.ID;

  if (!PAGE_ID) return;

  set(PROJECT_ID_ATOM, PAGE_ID);
  set(PROJECTS_ATOM, newList);
});
