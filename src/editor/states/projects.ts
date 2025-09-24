import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { canvasTheme } from "./canvas";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageShapeIds } from "./pages";
import { ALL_SHAPES, WithInitialValue } from "./shapes";
import { IKeyTool } from "./tool";
import { UndoRedoAction } from "./undo-redo";

export type IPROJECT = {
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
] as IPROJECT[]);

export const PROJECT_ATOM = atom((get) => {
  const PROJECT_ID = get(PROJECT_ID_ATOM);
  const PROJECTS = get(PROJECTS_ATOM);
  const FIND_PROJECT = PROJECTS?.find((p) => p?.ID === PROJECT_ID);
  if (!FIND_PROJECT) {
    throw new Error("PROJECT NOT FOUND");
  }
  return FIND_PROJECT;
});

export const NEW_PROJECT = atom(null, (get, set) => {
  const NEWPROJECTID = uuidv4();
  const NEW_DESIGN_MODE_UUID = uuidv4();
  const NEWEDIT_IMAGE_UUID = uuidv4();
  const NEW_FREE_DRAW_UUID = uuidv4();

  set(PROJECTS_ATOM, [
    ...get(PROJECTS_ATOM),
    {
      ID: NEWPROJECTID,
      name: atom("Project"),
      MODE_ATOM: atom<MODE>("DESIGN_MODE"),
      TOOL: atom<IKeyTool>("MOVE"),

      PAUSE_MODE: atom<boolean>(false),
      MODE: {
        DESIGN_MODE: {
          LIST: atom<IPage[]>([
            {
              id: NEW_DESIGN_MODE_UUID,
              name: atom("Page 1"),
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
            },
          ]),
          ID: atom<string>(NEW_DESIGN_MODE_UUID),
        },
      },

      EVENT: atom<IStageEvents>("IDLE"),
    },
  ]);
  set(PROJECT_ID_ATOM, NEWPROJECTID);
});

/// el delete debe eliminar la pagina y ubicar en que posicion estaba ese id de la pagina y seleccionar la siguiente pagina o caso contrario que tome la ultima. si la pagina era la ultima

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
