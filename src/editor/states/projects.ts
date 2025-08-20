import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { MODE } from "../hooks/useConfiguration";
import { canvasTheme } from "./canvas";
import { ICLIP_DIMENSION } from "./clipImage";
import { IStageEvents } from "./event";
import { INITIAL_RENDER_IMAGE, IRENDER_IMAGE } from "./image";
import { IPage } from "./pages";
import { ALL_SHAPES, WithInitialValue } from "./shapes";
import { IKeyTool } from "./tool";

export type IPROJECT = {
  ID: string;
  name: PrimitiveAtom<string> & WithInitialValue<string>;
  MODE_ATOM: PrimitiveAtom<MODE> & WithInitialValue<MODE>;
  TOOL: PrimitiveAtom<IKeyTool> & WithInitialValue<IKeyTool>;
  PAUSE_MODE: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
  PAGE: {
    LIST: PrimitiveAtom<IPage[]> & WithInitialValue<IPage[]>;
    ID: PrimitiveAtom<string> & WithInitialValue<string>;
  };
  SHAPE: {
    LIST: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
    ID: PrimitiveAtom<string | null> & WithInitialValue<string | null>;
  };
  EVENT: PrimitiveAtom<IStageEvents> & WithInitialValue<IStageEvents>;
  CLIP: {
    SHOW: PrimitiveAtom<boolean> & WithInitialValue<boolean>;
    DIMENSION: PrimitiveAtom<ICLIP_DIMENSION> &
      WithInitialValue<ICLIP_DIMENSION>;
  };
  IMAGE: {
    ORIGINAL: PrimitiveAtom<IRENDER_IMAGE> & WithInitialValue<IRENDER_IMAGE>;
    RENDER: PrimitiveAtom<IRENDER_IMAGE> & WithInitialValue<IRENDER_IMAGE>;
  };
};
export const PROJECT_ID_ATOM = atom<string>(
  "415ee03c-ce26-4e8b-b373-8c1c0e0d9dd4"
);

export const PROJECTS_ATOM = atom([
  {
    ID: "415ee03c-ce26-4e8b-b373-8c1c0e0d9dd4",
    name: atom("Project"),
    MODE_ATOM: atom<MODE>("DESIGN_MODE"),
    TOOL: atom<IKeyTool>("MOVE"),
    PAUSE_MODE: atom<boolean>(false),
    PAGE: {
      LIST: atom<IPage[]>([
        {
          id: "f860ad7b-27ac-491a-ba77-1a81f004dac1",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "EDIT_IMAGE",
        },
        {
          id: "bc0631c9-e167-4cef-887c-4d6f9b4d8dc6",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "FREE_DRAW",
        },
        {
          id: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "DESIGN_MODE",
        },
      ]),
      ID: atom<string>("8eb9cfc3-023f-4204-a745-3d5347d1f057"),
    },
    SHAPE: {
      ID: atom<string | null>(null),
      LIST: atom<ALL_SHAPES[]>([]),
    },
    EVENT: atom<IStageEvents>("IDLE"),
    CLIP: {
      SHOW: atom(false),
      DIMENSION: atom({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
    },
    IMAGE: {
      ORIGINAL: atom(INITIAL_RENDER_IMAGE),
      RENDER: atom(INITIAL_RENDER_IMAGE),
    },
  },
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
  const PAGEUUID = uuidv4();
  const NEWPROJECTID = uuidv4();
  set(PROJECTS_ATOM, [
    ...get(PROJECTS_ATOM),
    {
      ID: NEWPROJECTID,
      name: atom("Project"),
      MODE_ATOM: atom<MODE>("DESIGN_MODE"),
      TOOL: atom<IKeyTool>("MOVE"),
      PAUSE_MODE: atom<boolean>(false),
      PAGE: {
        LIST: atom<IPage[]>([
          {
            id: uuidv4(),
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "EDIT_IMAGE",
          },
          {
            id: uuidv4(),
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "FREE_DRAW",
          },
          {
            id: PAGEUUID,
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "DESIGN_MODE",
          },
        ]),
        ID: atom<string>(PAGEUUID),
      },
      SHAPE: {
        ID: atom<string | null>(null),
        LIST: atom<ALL_SHAPES[]>([]),
      },
      EVENT: atom<IStageEvents>("IDLE"),
      CLIP: {
        SHOW: atom(false),
        DIMENSION: atom({
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        }),
      },
      IMAGE: {
        ORIGINAL: atom(INITIAL_RENDER_IMAGE),
        RENDER: atom(INITIAL_RENDER_IMAGE),
      },
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
