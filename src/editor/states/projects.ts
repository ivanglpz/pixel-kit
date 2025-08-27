import { atom, PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { MODE } from "../hooks/useConfiguration";
import { IShape } from "../shapes/type.shape";
import { canvasTheme } from "./canvas";
import { ICLIP_DIMENSION } from "./clipImage";
import { IStageEvents } from "./event";
import { INITIAL_RENDER_IMAGE, IRENDER_IMAGE } from "./image";
import { IPage } from "./pages";
import { ALL_SHAPES, WithInitialValue } from "./shapes";
import { IKeyTool } from "./tool";
import { UNDO_REDO_PROPS } from "./undo-redo";

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
  UNDOREDO: {
    COUNT_UNDO_REDO: PrimitiveAtom<number> & WithInitialValue<number>;
    LIST_UNDO_REDO: PrimitiveAtom<UNDO_REDO_PROPS[]> &
      WithInitialValue<UNDO_REDO_PROPS[]>;
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
    UNDOREDO: {
      COUNT_UNDO_REDO: atom<number>(0),
      LIST_UNDO_REDO: atom<UNDO_REDO_PROPS[]>([]),
    },
    PAGE: {
      LIST: atom<IPage[]>([
        {
          id: "f860ad7b-27ac-491a-ba77-1a81f004dac1",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "EDIT_IMAGE",
          SHAPE: {
            ID: atom<string[]>([]),
            LIST: atom<ALL_SHAPES[]>([]),
          },
        },
        {
          id: "bc0631c9-e167-4cef-887c-4d6f9b4d8dc6",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "FREE_DRAW",
          SHAPE: {
            ID: atom<string[]>([]),
            LIST: atom<ALL_SHAPES[]>([]),
          },
        },
        {
          id: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
          name: atom("Page 1"),
          color: atom(canvasTheme.dark),
          isVisible: atom(true),
          type: "DESIGN_MODE",
          SHAPE: {
            ID: atom<string[]>([]),
            LIST: atom<ALL_SHAPES[]>([
              {
                id: "6dec1d40-cc1e-4217-b53a-4991feb3cf87",
                tool: "GROUP",
                pageId: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
                state: atom({
                  id: "d459d81f-4bce-4c41-af07-fe4d979d7771",
                  x: 187,
                  y: 181,
                  tool: "GROUP",
                  align: "left",
                  verticalAlign: "top",
                  bordersRadius: [0, 0, 0, 0],
                  effects: [],
                  isLocked: false,
                  fillContainerHeight: false,
                  fillContainerWidth: false,
                  label: "GROUP",
                  parentId: null,
                  rotation: 0,
                  opacity: 1,
                  fills: [
                    {
                      visible: true,
                      color: "#ffffff",
                      opacity: 1,
                      type: "fill",
                      id: "0bd0c14a-eaa1-405b-b8cf-39a20f854288",
                      image: {
                        height: 0,
                        name: "",
                        src: "",
                        width: 0,
                      },
                    },
                  ],
                  layouts: [],
                  strokes: [],
                  visible: true,
                  height: 227,
                  width: 111,
                  points: [],
                  strokeWidth: 1,
                  lineCap: "round",
                  lineJoin: "round",
                  shadowBlur: 0,
                  shadowOffsetY: 1,
                  shadowOffsetX: 1,
                  shadowOpacity: 1,
                  isAllBorderRadius: false,
                  borderRadius: 0,
                  dash: 0,
                  fontStyle: "Roboto",
                  textDecoration: "none",
                  fontWeight: "normal",
                  fontFamily: "Roboto",
                  fontSize: 24,
                  text: "Hello World",
                } as IShape),
                children: atom([
                  {
                    id: "c73a53c1-5392-4159-aa33-0857e9b4d2e6",
                    tool: "GROUP",
                    pageId: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
                    state: atom({
                      id: "85f26efc-856d-4c33-92f3-f6bd5dfc713e",
                      x: 187,
                      y: 181,
                      tool: "GROUP",
                      align: "left",
                      verticalAlign: "top",
                      bordersRadius: [0, 0, 0, 0],
                      effects: [],
                      isLocked: false,
                      fillContainerHeight: false,
                      fillContainerWidth: false,
                      label: "GROUP",
                      parentId: null,
                      rotation: 0,
                      opacity: 1,
                      fills: [
                        {
                          visible: true,
                          color: "#ffffff",
                          opacity: 1,
                          type: "fill",
                          id: "0bd0c14a-eaa1-405b-b8cf-39a20f854288",
                          image: {
                            height: 0,
                            name: "",
                            src: "",
                            width: 0,
                          },
                        },
                      ],
                      layouts: [],
                      strokes: [],
                      visible: true,
                      height: 227,
                      width: 111,
                      points: [],
                      strokeWidth: 1,
                      lineCap: "round",
                      lineJoin: "round",
                      shadowBlur: 0,
                      shadowOffsetY: 1,
                      shadowOffsetX: 1,
                      shadowOpacity: 1,
                      isAllBorderRadius: false,
                      borderRadius: 0,
                      dash: 0,
                      fontStyle: "Roboto",
                      textDecoration: "none",
                      fontWeight: "normal",
                      fontFamily: "Roboto",
                      fontSize: 24,
                      text: "Hello World",
                    } as IShape),
                    children: atom([]),
                  },
                  {
                    id: "117e35f9-1d44-42a6-839e-76bc9ca51e4b",
                    tool: "GROUP",
                    pageId: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
                    state: atom({
                      id: "26b14bc8-d9bf-4870-b52d-f9a2300ee096",
                      x: 187,
                      y: 181,
                      tool: "GROUP",
                      align: "left",
                      verticalAlign: "top",
                      bordersRadius: [0, 0, 0, 0],
                      effects: [],
                      isLocked: false,
                      fillContainerHeight: false,
                      fillContainerWidth: false,
                      label: "GROUP",
                      parentId: null,
                      rotation: 0,
                      opacity: 1,
                      fills: [
                        {
                          visible: true,
                          color: "#ffffff",
                          opacity: 1,
                          type: "fill",
                          id: "0bd0c14a-eaa1-405b-b8cf-39a20f854288",
                          image: {
                            height: 0,
                            name: "",
                            src: "",
                            width: 0,
                          },
                        },
                      ],
                      layouts: [],
                      strokes: [],
                      visible: true,
                      height: 227,
                      width: 111,
                      points: [],
                      strokeWidth: 1,
                      lineCap: "round",
                      lineJoin: "round",
                      shadowBlur: 0,
                      shadowOffsetY: 1,
                      shadowOffsetX: 1,
                      shadowOpacity: 1,
                      isAllBorderRadius: false,
                      borderRadius: 0,
                      dash: 0,
                      fontStyle: "Roboto",
                      textDecoration: "none",
                      fontWeight: "normal",
                      fontFamily: "Roboto",
                      fontSize: 24,
                      text: "Hello World",
                    } as IShape),
                    children: atom([]),
                  },
                  {
                    id: "5d6e3538-1f94-4383-b2e1-4f14c89318b0",
                    tool: "GROUP",
                    pageId: "8eb9cfc3-023f-4204-a745-3d5347d1f057",
                    state: atom({
                      id: "22814ad7-ede7-4088-99a9-c6cc10f77455",
                      x: 187,
                      y: 181,
                      tool: "GROUP",
                      align: "left",
                      verticalAlign: "top",
                      bordersRadius: [0, 0, 0, 0],
                      effects: [],
                      isLocked: false,
                      fillContainerHeight: false,
                      fillContainerWidth: false,
                      label: "GROUP",
                      parentId: null,
                      rotation: 0,
                      opacity: 1,
                      fills: [
                        {
                          visible: true,
                          color: "#ffffff",
                          opacity: 1,
                          type: "fill",
                          id: "0bd0c14a-eaa1-405b-b8cf-39a20f854288",
                          image: {
                            height: 0,
                            name: "",
                            src: "",
                            width: 0,
                          },
                        },
                      ],
                      layouts: [],
                      strokes: [],
                      visible: true,
                      height: 227,
                      width: 111,
                      points: [],
                      strokeWidth: 1,
                      lineCap: "round",
                      lineJoin: "round",
                      shadowBlur: 0,
                      shadowOffsetY: 1,
                      shadowOffsetX: 1,
                      shadowOpacity: 1,
                      isAllBorderRadius: false,
                      borderRadius: 0,
                      dash: 0,
                      fontStyle: "Roboto",
                      textDecoration: "none",
                      fontWeight: "normal",
                      fontFamily: "Roboto",
                      fontSize: 24,
                      text: "Hello World",
                    } as IShape),
                    children: atom([]),
                  },
                ] as IShape[]),
              },
            ]),
          },
        },
      ]),
      ID: atom<string>("8eb9cfc3-023f-4204-a745-3d5347d1f057"),
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
      UNDOREDO: {
        COUNT_UNDO_REDO: atom<number>(0),
        LIST_UNDO_REDO: atom<UNDO_REDO_PROPS[]>([]),
      },
      PAUSE_MODE: atom<boolean>(false),
      PAGE: {
        LIST: atom<IPage[]>([
          {
            id: uuidv4(),
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "EDIT_IMAGE",
            SHAPE: {
              ID: atom<string[]>([]),
              LIST: atom<ALL_SHAPES[]>([]),
            },
          },
          {
            id: uuidv4(),
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "FREE_DRAW",
            SHAPE: {
              ID: atom<string[]>([]),
              LIST: atom<ALL_SHAPES[]>([]),
            },
          },
          {
            id: PAGEUUID,
            name: atom("Page 1"),
            color: atom(canvasTheme.dark),
            isVisible: atom(true),
            type: "DESIGN_MODE",
            SHAPE: {
              ID: atom<string[]>([]),
              LIST: atom<ALL_SHAPES[]>([]),
            },
          },
        ]),
        ID: atom<string>(PAGEUUID),
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
