/* eslint-disable react-hooks/exhaustive-deps */
import { icons } from "@/editor/icons/tool-icons";
import { atom } from "jotai";
import { formats } from "../constants/formats";
import { CreateShapeSchema } from "../helpers/shape-schema";
import { ShapeState } from "../shapes/types/shape.state";
import { IStageEvents } from "../states/event";
import { PROJECT_ATOM } from "../states/projects";
import { IKeyTool } from "../states/tool";
import {
  createStagesFromShapes,
  exportAndDownloadStages,
} from "../utils/export";
import { typeExportAtom } from "./export";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, {
  ALL_SHAPES,
  computeStageBounds,
  PLANE_SHAPES_ATOM,
} from "./shapes";
import { cloneShapeRecursive } from "./undo-redo";

export type MODE = "DESIGN_MODE";

export type Config = {
  show_layer_image: boolean;
  export_mode: MODE;
  mode: MODE;
  show_files_browser: boolean;
  background_color: string;
  show_canvas_config: boolean;
  show_clip_config: boolean;
  tools: {
    icon?: JSX.Element;
    keyMethod?: IKeyTool;
    keyBoard?: string;
    eventStage?: IStageEvents;
    showClip?: boolean;
  }[];
  show_layer_background: boolean;
  show_layer_clip: boolean;
  expand_stage: boolean;
  expand_stage_resolution?: {
    width: number;
    height: number;
  };
  scrollInsideStage: boolean;
};

const configs: { [key in MODE]: Config } = {
  DESIGN_MODE: {
    show_layer_image: false,
    export_mode: "DESIGN_MODE",
    mode: "DESIGN_MODE",
    show_files_browser: false,
    background_color: "#FFFFFF",
    show_canvas_config: true,
    show_clip_config: false,
    expand_stage: true,
    expand_stage_resolution: {
      width: 1920,
      height: 1080,
    },
    tools: [
      {
        icon: icons.cursor,
        keyMethod: "MOVE",
        keyBoard: "Q",
        eventStage: "IDLE",
      },
      {
        icon: icons.box,
        keyMethod: "FRAME",
        keyBoard: "W",
        eventStage: "CREATE",
      },

      // {
      //   icon: icons.circle,
      //   keyMethod: "CIRCLE",
      //   keyBoard: "E",
      //   eventStage: "CREATE",
      // },
      // {
      //   icon: icons.line,
      //   keyMethod: "LINE",
      //   keyBoard: "R",
      //   eventStage: "CREATE",
      // },
      {
        icon: icons.image,
        keyMethod: "IMAGE",
        keyBoard: "E",
        eventStage: "CREATE",
      },
      {
        icon: icons.text,
        keyMethod: "TEXT",
        keyBoard: "R",
        eventStage: "CREATE",
      },
      {
        icon: icons.icon,
        keyMethod: "ICON",
        keyBoard: "A",
        eventStage: "CREATE",
      },
      {
        icon: icons.peentool,
        keyMethod: "DRAW",
        keyBoard: "S",
        eventStage: "CREATE",
      },
      // {
      //   icon: icons.group,
      //   keyMethod: "GROUP",
      //   keyBoard: "F",
      //   eventStage: "CREATE",
      // },
    ],
    show_layer_background: true,
    show_layer_clip: false,
    scrollInsideStage: false,
  },
};

export const OPTIONS_CONFIG = Object.keys(configs)?.map((e, index) => ({
  id: e + index,
  label: e,
  value: e,
}));

export const MODE_ATOM = atom(
  (get) => get(get(PROJECT_ATOM).MODE_ATOM),
  (_get, _set, newTool: MODE) => {
    const toolAtom = _get(PROJECT_ATOM).MODE_ATOM;
    _set(toolAtom, newTool);
  }
);
export const CONFIG_ATOM = atom(
  (get) => configs[get(MODE_ATOM)] || configs.DESIGN_MODE
);

export const GET_EXPORT_JSON = atom(null, (get) => {
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const planeShapes = get(PLANE_SHAPES_ATOM);
  const cloner = cloneShapeRecursive(get);
  const shapes = planeShapes
    .filter((shape) =>
      selectedIds.some(
        (selected) =>
          shape.id === selected.id &&
          get(get(shape.state).parentId) === selected.parentId
      )
    )
    .map(cloner);

  return {
    shapes,
  };
});

export const GET_EXPORT_SHAPES = atom(null, async (get, set) => {
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const planeShapes = get(PLANE_SHAPES_ATOM);
  const format = get(typeExportAtom);
  const shapes = planeShapes.filter((shape) =>
    selectedIds.some(
      (selected) =>
        shape.id === selected.id &&
        get(get(shape.state).parentId) === selected.parentId
    )
  );
  const stagesWithContainers = await createStagesFromShapes(shapes, { get });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const stages = stagesWithContainers.map((s) => s.stage);

  exportAndDownloadStages(
    stages,
    "png",
    formats[format as keyof typeof formats]
  );
});
export const GET_EXPORT_ALLSHAPES_ATOM = atom(null, async (get) => {
  const roots = get(ALL_SHAPES_ATOM);
  if (roots.length === 0) return;

  const bounds = computeStageBounds(get)(roots);

  const virtualRoot: ALL_SHAPES = {
    id: "__EXPORT_ROOT__",
    tool: "FRAME",
    state: atom(
      CreateShapeSchema({
        id: "__EXPORT_ROOT__",
        tool: "FRAME",
        x: atom(-bounds.startX),
        y: atom(-bounds.startY),
        width: atom(bounds.width),
        height: atom(bounds.height),
        rotation: atom(0),
        opacity: atom(1),
        visible: atom(true),
        parentId: atom<string | null>(null),
        children: atom(roots),
        fillColor: atom("transparent"),
        strokeColor: atom("transparent"),
        strokeWidth: atom(0),
      }) as ShapeState
    ),
  };

  const [{ stage }] = await createStagesFromShapes([virtualRoot], { get });
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  const dataURL = stage.toDataURL({
    mimeType: "image/png",
    pixelRatio: 1,
    quality: 1,
    x: bounds.startX,
    y: bounds.startY,
    width: bounds.width,
    height: bounds.height,
  });

  console.log(dataURL);
});
