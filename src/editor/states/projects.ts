import { atom, PrimitiveAtom } from "jotai";
import { atomWithDefault } from "jotai/utils";
import { IShape } from "../shapes/type.shape";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageJSON, IPageShapeIds } from "./pages";
import { ALL_SHAPES, ALL_SHAPES_CHILDREN, WithInitialValue } from "./shapes";
import { GET_PROJECTS, TABS_PERSIST_ATOM } from "./tabs";
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
      ID: PrimitiveAtom<string | null> & WithInitialValue<string | null>;
    };
  };
  PREVIEW_URL: string;
  EVENT: PrimitiveAtom<IStageEvents> & WithInitialValue<IStageEvents>;
};

export const PROJECT_ID_ATOM = atomWithDefault<string | null>(() => {
  if (typeof window === "undefined" || !window.location) {
    return null;
  }

  const ID = window.location.pathname.split("/").at(-1);

  return ID ?? null;
});
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
  PREVIEW_URL: "./placeholder.svg",
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
      ID: atom<string | null>("mockup-page-one"),
    },
  },
};
export const PROJECTS_ATOM = atom<IEDITORPROJECT[]>([]);
export const SET_PROJECTS_FROM_TABS = atom(null, (get, set) => {
  const DATA = GET_PROJECTS();
  // const PERSIST = get(TABS_PERSIST_ATOM);
  const projects = DATA?.map((project) => {
    const DATA = JSON.parse(project.data);
    const LIST_PAGES = DATA[project.mode]?.LIST as IPageJSON[];

    const FIRST_PAGE = LIST_PAGES.at(0);

    return {
      ID: project._id,
      name: atom(project.name),
      MODE_ATOM: atom<MODE>(project.mode),
      TOOL: atom<IKeyTool>("MOVE"),
      PREVIEW_URL: project?.previewUrl ?? "./placeholder.svg",
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
          ID: atom<string | null>(FIRST_PAGE?.id ?? null),
        },
      },

      EVENT: atom<IStageEvents>("IDLE"),
    };
  });
  set(PROJECTS_ATOM, projects);
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

export const JSON_PROJECTS_ATOM = atom(null, (get, set) => {
  const project = get(PROJECT_ATOM);

  const cloneShapeJson = (shape: ALL_SHAPES): ALL_SHAPES_CHILDREN => {
    return {
      id: shape.id,
      pageId: shape.pageId,
      tool: shape.tool,
      state: {
        ...get(shape.state),
        children: get(get(shape.state).children).map((c) => cloneShapeJson(c)),
      },
    };
  };
  const LIST = get(project.MODE[get(project.MODE_ATOM)].LIST)?.map(
    (element) => {
      return {
        id: element.id,
        name: get(element.name),
        color: get(element.color),
        isVisible: get(element.isVisible),
        SHAPES: {
          LIST: get(element.SHAPES.LIST).map((e) => cloneShapeJson(e)),
        },
      };
    }
  );

  return {
    projectId: project.ID,
    projectName: get(project.name),
    previewUrl: project?.PREVIEW_URL ?? "./placeholder.svg",
    data: JSON.stringify({
      [get(project.MODE_ATOM)]: {
        LIST: LIST,
      },
    }),
  };
});
export const DELETE_PROJECT = atom(null, (get, set, id: string) => {
  const persistProjects = get(TABS_PERSIST_ATOM);
  const projects = get(PROJECTS_ATOM);

  // Filtrar proyecto a borrar
  const newPersistList = persistProjects.filter((e) => e._id !== id);
  const newProjectsList = projects.filter((e) => e.ID !== id);

  // Actualizar los átomos
  set(TABS_PERSIST_ATOM, newPersistList); // Persistente
  set(PROJECTS_ATOM, newProjectsList); // En memoria

  // Actualizar el proyecto activo
  const nextProject = newPersistList[0]?._id || null;
  set(PROJECT_ID_ATOM, nextProject);
});
