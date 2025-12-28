import { IProject } from "@/db/schemas/types";
import { api } from "@/services/axios";
import { atom, PrimitiveAtom } from "jotai";
import { atomWithDefault } from "jotai/utils";
import { ShapeBase } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { SVG } from "../utils/svg";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPageBase, IPageState, IShapeId } from "./pages";
import { ALL_SHAPES, SHAPE_BASE_CHILDREN, WithInitialValue } from "./shapes";
import { GET_TABS_BY_USER, TABS_PERSIST_ATOM, TabsProps } from "./tabs";
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
      LIST: PrimitiveAtom<IPageState[]> & WithInitialValue<IPageState[]>;
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
const cloneShapeRecursive = (shape: SHAPE_BASE_CHILDREN): ALL_SHAPES => {
  const fill = shape.state.fills?.find((f) => f.visible && f.type === "fill");
  const stroke = shape.state?.strokes?.filter((e) => e?.visible)?.at(0);
  const shadow = shape.state?.effects
    ?.filter((e) => e?.visible && e?.type === "shadow")
    .at(0);
  const SHAPE_IMAGE = shape.state.fills?.find(
    (f) => f.visible && f.type === "image"
  )?.image;

  const theTool = SHAPE_IMAGE?.src
    ? SVG.IsEncode(SHAPE_IMAGE.src)
      ? "ICON"
      : shape.tool
    : shape.tool;

  const data: ShapeState = Object.fromEntries(
    Object.entries(shape.state).map(([key, value]) => {
      if (key === "children") {
        return [
          key,
          atom(shape.state.children.map((c) => cloneShapeRecursive(c))),
        ];
      }
      if (key === "id") {
        return [key, value];
      }
      if (key === "tool") {
        return [key, theTool];
      }
      return [key, atom(value as ShapeBase[keyof ShapeBase])];
    })
  );

  return {
    id: shape.id,
    tool: theTool,
    state: atom({
      ...data,
      shadowColor: atom(
        shadow?.color ?? shape?.state?.shadowColor ?? "transparent"
      ),
      fillColor: atom(fill?.color ?? shape?.state?.fillColor ?? "transparent"),
      strokeColor: atom(
        stroke?.color ?? shape?.state?.strokeColor ?? "transparent"
      ),
      image: atom(
        SHAPE_IMAGE ??
          shape?.state?.image ?? {
            height: 100,
            name: "default.png",
            src: "/placeholder.svg",
            width: 100,
          }
      ),
    } as ShapeState),
  };
};

export const MOCKUP_PROJECT: IPROJECT = {
  ID: "mockup-id",
  EVENT: atom<IStageEvents>("IDLE"),
  TOOL: atom<IKeyTool>("MOVE"),
  PAUSE_MODE: atom<boolean>(false),
  name: atom<string>("mockup-project-name"),
  MODE_ATOM: atom<MODE>("DESIGN_MODE"),
  PREVIEW_URL: "./default_bg.png",
  MODE: {
    DESIGN_MODE: {
      LIST: atom([
        {
          id: "mockup-page-one",
          color: atom("black"),
          isVisible: atom(true),
          name: atom("Mockup Page One"),
          SHAPES: {
            ID: atom<IShapeId[]>([]),
            LIST: atom<ALL_SHAPES[]>([]),
          },
          UNDOREDO: {
            COUNT_UNDO_REDO: atom<number>(0),
            LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
          },
          VIEWPORT: {
            SCALE: atom({ x: 1, y: 1 }),
            POSITION: atom({ x: 0, y: 0 }),
          },
        },
      ] as IPageState[]),
      ID: atom<string | null>("mockup-page-one"),
    },
  },
};
export const PROJECTS_ATOM = atom<IPROJECT[]>([]);
type ProjectApiResponse = {
  data: IProject;
};

const fetchProjectById = async (id: string): Promise<IProject> => {
  const response = await api.get<ProjectApiResponse>(`/projects/byId?id=${id}`);
  return response.data.data;
};

const parseProjectData = (rawData: string, mode: MODE) => {
  const parsed = JSON.parse(rawData);
  const modeData = parsed[mode] ?? {};

  const pages = (modeData.LIST ?? []) as IPageBase[];
  const selectedPageId = (modeData.ID ?? null) as string | null;

  return {
    pages,
    selectedPageId,
    firstPageId: pages[0]?.id ?? null,
  };
};

const buildPagesAtom = (pages: IPageBase[]) =>
  atom(
    pages.map((page) => {
      const shapes = page.SHAPES?.LIST?.map(cloneShapeRecursive) ?? [];

      return {
        id: page.id,
        name: atom(page.name),
        color: atom(page.color),
        isVisible: atom(page.isVisible),
        VIEWPORT: {
          SCALE: atom(page.VIEWPORT?.SCALE ?? { x: 1, y: 1 }),
          POSITION: atom(page.VIEWPORT?.POSITION ?? { x: 0, y: 0 }),
        },
        SHAPES: {
          ID: atom<IShapeId[]>([]),
          LIST: atom<ALL_SHAPES[]>(shapes),
        },
        UNDOREDO: {
          COUNT_UNDO_REDO: atom<number>(0),
          LIST_UNDO_REDO: atom<UndoRedoAction[]>([]),
        },
      };
    })
  );

const buildProjectAtom = async (item: TabsProps): Promise<IPROJECT | null> => {
  try {
    const project = await fetchProjectById(item._id);
    const { pages, selectedPageId, firstPageId } = parseProjectData(
      project.data,
      item.mode
    );

    return {
      ID: item._id,
      name: atom(project.name),
      MODE_ATOM: atom<MODE>(item.mode),
      TOOL: atom<IKeyTool>("MOVE"),
      PREVIEW_URL: item.previewUrl ?? "./default_bg.png",
      PAUSE_MODE: atom<boolean>(false),
      MODE: {
        [item.mode]: {
          LIST: buildPagesAtom(pages),
          ID: atom<string | null>(selectedPageId ?? firstPageId ?? null),
        },
      },
      EVENT: atom<IStageEvents>("IDLE"),
    };
  } catch {
    return null;
  }
};

export const SET_PROJECTS_FROM_TABS = atom(null, async (get, set) => {
  const projectsStore = get(GET_TABS_BY_USER);
  const listProjects = get(PROJECTS_ATOM);
  const searchProjectsLoaded = projectsStore.filter((p) =>
    listProjects.some((lp) => lp.ID === p._id)
  );

  if (searchProjectsLoaded.length === projectsStore.length) return;

  const results = await Promise.allSettled(projectsStore.map(buildProjectAtom));

  const projects = results
    .filter(
      (res): res is PromiseFulfilledResult<IPROJECT> =>
        res.status === "fulfilled" && res.value !== null
    )
    .map((res) => res.value);

  set(PROJECTS_ATOM, projects);
});

export const PROJECT_ATOM = atom((get) => {
  const PROJECT_ID = get(PROJECT_ID_ATOM);
  const PROJECTS = get(PROJECTS_ATOM);
  const FIND_PROJECT = PROJECTS?.find((p) => p?.ID === PROJECT_ID);

  return FIND_PROJECT ?? MOCKUP_PROJECT;
});

export type UpdatableKeys = keyof Omit<
  ShapeState,
  "id" | "tool" | "children" | "parentId"
>;

export const GET_JSON_PROJECTS_ATOM = atom(null, (get, set) => {
  const project = get(PROJECT_ATOM);

  const cloneShapeJson = (shape: ALL_SHAPES): SHAPE_BASE_CHILDREN => {
    const state = get(shape.state);
    const data: ShapeBase = Object.fromEntries(
      Object.entries(state).map(([key, value]) => {
        if (key === "children")
          return [
            key,
            get(get(shape.state).children).map((c) => cloneShapeJson(c)),
          ];
        if (key === "id" || key === "tool") {
          return [key, value];
        }
        return [key, get(value as PrimitiveAtom<ShapeBase[keyof ShapeBase]>)];
      })
    );

    return {
      id: shape.id,
      tool: shape.tool,
      state: data,
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
        VIEWPORT: {
          SCALE: get(element.VIEWPORT.SCALE),
          POSITION: get(element.VIEWPORT.POSITION),
        },
      };
    }
  );

  return {
    projectId: project.ID,
    projectName: get(project.name),
    previewUrl: project?.PREVIEW_URL ?? "./default_bg.png",
    data: JSON.stringify({
      [get(project.MODE_ATOM)]: {
        LIST: LIST,
        ID: get(project.MODE[get(project.MODE_ATOM)].ID),
      },
    }),
  };
});
export const REMOVE_PROJECT_TAB_ATOM = atom(null, (get, set, id: string) => {
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
