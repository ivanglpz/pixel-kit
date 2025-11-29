import { IProject } from "@/db/schemas/types";
import { api } from "@/services/axios";
import { atom, PrimitiveAtom } from "jotai";
import { atomWithDefault } from "jotai/utils";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { CreateShapeSchema } from "../helpers/shape-schema";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { Align, FontWeight, VerticalAlign } from "../shapes/type.shape";
import { ShapeState } from "../shapes/types/shape.state";
import { IStageEvents } from "./event";
import { MODE } from "./mode";
import { IPage, IPageJSON, IPageShapeIds } from "./pages";
import { ALL_SHAPES, SHAPE_BASE_CHILDREN, WithInitialValue } from "./shapes";
import { GET_PROJECTS_BY_USER, TABS_PERSIST_ATOM } from "./tabs";
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
const cloneShapeRecursive = (shape: SHAPE_BASE_CHILDREN): ALL_SHAPES => {
  return {
    id: shape.id,
    tool: shape.tool,
    state: atom({
      id: shape.id,
      x: atom(shape.state.x),
      y: atom(shape.state.y),
      tool: shape.state.tool,
      align: atom<Align>(shape.state.align),
      offsetX: atom(shape.state.offsetX),
      copyX: atom(shape.state.copyX),
      copyY: atom(shape.state.copyY),
      offsetCopyX: atom(shape.state.offsetCopyX),
      offsetCopyY: atom(shape.state.offsetCopyY),
      offsetY: atom(shape.state.offsetY),
      verticalAlign: atom<VerticalAlign>(shape.state.verticalAlign),
      paddingBottom: atom(shape.state.paddingBottom),
      paddingTop: atom(shape.state.paddingTop),
      borderBottomLeftRadius: atom(shape.state.borderBottomLeftRadius),
      isAllPadding: atom(shape.state.isAllPadding),
      borderBottomRightRadius: atom(shape.state.borderBottomRightRadius),
      borderTopLeftRadius: atom(shape.state.borderTopLeftRadius),
      borderTopRightRadius: atom(shape.state.borderTopRightRadius),
      paddingLeft: atom(shape.state.paddingLeft),
      paddingRight: atom(shape.state.paddingRight),
      padding: atom(shape.state.padding),
      maxHeight: atom(shape.state.maxHeight),
      maxWidth: atom(shape.state.maxWidth),
      minHeight: atom(shape.state.minHeight),
      minWidth: atom(shape.state.minWidth),
      shadowColor: atom(shape?.state?.shadowColor ?? "#ffffff"),
      fillColor: atom(shape?.state?.fillColor ?? "#ffffffffffff"),
      strokeColor: atom(shape?.state?.strokeColor ?? "#ffffff"),
      image: atom(
        shape?.state?.image ?? {
          height: 100,
          name: "default.png",
          src: "/placeholder.svg",
          width: 100,
        }
      ),

      isLocked: atom(shape.state.isLocked),
      fillContainerHeight: atom(shape.state.fillContainerHeight),
      fillContainerWidth: atom(shape.state.fillContainerWidth),
      label: atom(shape.state.label),
      parentId: atom<string | null>(shape.state.parentId),
      rotation: atom(shape.state.rotation),
      opacity: atom(shape.state.opacity),
      isLayout: atom(shape.state.isLayout),
      alignItems: atom<AlignItems>(shape.state.alignItems),
      flexDirection: atom<FlexDirection>(shape.state.flexDirection),
      flexWrap: atom<FlexWrap>(shape.state.flexWrap),
      justifyContent: atom<JustifyContent>(shape.state.justifyContent),
      gap: atom(shape.state.gap),

      visible: atom(shape.state.visible),
      height: atom(shape.state.height),
      width: atom(shape.state.width),
      points: atom<number[]>(shape.state.points),
      strokeWidth: atom(shape.state.strokeWidth),
      lineCap: atom<LineCap>(shape.state.lineCap),
      lineJoin: atom<LineJoin>(shape.state.lineJoin),
      shadowBlur: atom(shape.state.shadowBlur),
      shadowOffsetY: atom(shape.state.shadowOffsetY),
      shadowOffsetX: atom(shape.state.shadowOffsetX),
      shadowOpacity: atom(shape.state.shadowOpacity),
      isAllBorderRadius: atom(shape.state.isAllBorderRadius),
      borderRadius: atom(shape.state.borderRadius),
      dash: atom(shape.state.dash),
      fontStyle: atom(shape.state.fontStyle),
      textDecoration: atom(shape.state.textDecoration),
      fontWeight: atom<FontWeight>(shape.state.fontWeight),
      fontFamily: atom(shape.state.fontFamily),
      fontSize: atom(shape.state.fontSize),
      text: atom(shape.state.text),
      children: atom(shape.state.children.map((c) => cloneShapeRecursive(c))),
    } as ShapeState),
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
          name: atom("Loading..."),
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
export const SET_PROJECTS_FROM_TABS = atom(null, async (get, set) => {
  const DATA = get(GET_PROJECTS_BY_USER);

  const projectsResults = await Promise.allSettled(
    DATA?.map(async (item): Promise<IEDITORPROJECT | null> => {
      try {
        const response = await api.get<{ data: IProject }>(
          "/projects/byId?id=" + item._id
        );
        const project = response.data.data;
        const DATA_JSON = JSON.parse(response.data.data.data);
        const LIST_PAGES = DATA_JSON[item.mode]?.LIST as IPageJSON[];
        const FIRST_PAGE = LIST_PAGES?.[0];

        return {
          ID: item._id,
          name: atom(project.name),
          MODE_ATOM: atom<MODE>(item.mode),
          TOOL: atom<IKeyTool>("MOVE"),
          PREVIEW_URL: item?.previewUrl ?? "./placeholder.svg",
          PAUSE_MODE: atom<boolean>(false),
          MODE: {
            [item.mode]: {
              LIST: atom(
                LIST_PAGES?.map((page) => {
                  const LIST = page?.SHAPES?.LIST?.map(cloneShapeRecursive);
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
      } catch (error) {
        // Ignorar proyecto si falla la carga
        return null;
      }
    })
  );

  const projects = projectsResults
    .filter(
      (res): res is PromiseFulfilledResult<IEDITORPROJECT | null> =>
        res.status === "fulfilled" && res.value !== null
    )
    .map((res) => res.value as IEDITORPROJECT);

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

export const GET_JSON_PROJECTS_ATOM = atom(null, (get, set) => {
  const project = get(PROJECT_ATOM);

  const cloneShapeJson = (shape: ALL_SHAPES): SHAPE_BASE_CHILDREN => {
    return {
      id: shape.id,
      // pageId: shape.pageId,
      tool: shape.tool,
      state: {
        ...CreateShapeSchema(),
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
