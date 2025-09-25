import { IProject } from "@/db/schemas/types";
import { atom, PrimitiveAtom } from "jotai";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageShapeIds } from "./pages";
import { ALL_SHAPES, WithInitialValue } from "./shapes";
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

export const PROJECTS_ATOM = atom([
  // {
  //   ID: "415ee03c-ce26-4e8b-b373-8c1c0e0d9dd4",
  //   name: atom("Project"),
  //   MODE_ATOM: atom<MODE>("DESIGN_MODE"),
  //   TOOL: atom<IKeyTool>("MOVE"),
  //   PAUSE_MODE: atom<boolean>(false),
  //   MODE: {
  //     DESIGN_MODE: {
  //       LIST: atom<IPage[]>([
  //         {
  //           id: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
  //           name: atom("Page 1"),
  //           color: atom(canvasTheme.dark),
  //           isVisible: atom(true),
  //           SHAPES: {
  //             ID: atom<IPageShapeIds[]>([]),
  //             LIST: atom<ALL_SHAPES[]>([]),
  //           },
  //           UNDOREDO: {
  //             COUNT_UNDO_REDO: atom<number>(0),
  //             LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
  //           },
  //         },
  //       ]),
  //       ID: atom<string>("8eb9cfc3-023f-4204-a745-3d5347d1f057"),
  //     },
  //   },
  //   EVENT: atom<IStageEvents>("IDLE"),
  // },
] as IEDITORPROJECT[]);

export const PROJECT_ATOM = atom((get) => {
  const PROJECT_ID = get(PROJECT_ID_ATOM);
  const PROJECTS = get(PROJECTS_ATOM);
  const FIND_PROJECT = PROJECTS?.find((p) => p?.ID === PROJECT_ID);
  if (!FIND_PROJECT) {
    throw new Error("PROJECT NOT FOUND");
  }
  console.log(FIND_PROJECT);

  return FIND_PROJECT;
});

export const ADD_PROJECT = atom(null, (get, set, args: IProject) => {
  const DATA = JSON.parse(args.data);
  const LIST_PAGES = DATA[args.mode]?.LIST;
  console.log(args);
  console.log(LIST_PAGES.at(0).id);

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
            LIST_PAGES?.map((e) => {
              return {
                id: e.id,
                name: atom(e.name),
                color: atom(e.color),
                isVisible: atom(e.isVisible),
                SHAPES: {
                  ID: atom<IPageShapeIds[]>([]),
                  LIST: atom<ALL_SHAPES[]>(e.SHAPES.LIST),
                },
                UNDOREDO: {
                  COUNT_UNDO_REDO: atom<number>(0),
                  LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
                },
              };
            })
          ),
          ID: atom<string>(LIST_PAGES.at(0).id),
        },
      },

      EVENT: atom<IStageEvents>("IDLE"),
    },
  ]);
  set(PROJECT_ID_ATOM, args?._id);
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
