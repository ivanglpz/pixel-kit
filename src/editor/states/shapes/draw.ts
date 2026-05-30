import { atom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { Smile } from "lucide-static";
import { v4 as uuidv4 } from "uuid";
import { capitalize } from "../../utils/capitalize";
import { SVG } from "../../utils/svg";
import { CreateShapeSchema, isNotNegative } from "../../helpers/shape-schema";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../../shapes/layout-flex";
import type { ShapeImage } from "../../shapes/types/shape.base";
import { FontWeight, VerticalAlign } from "../../shapes/type.shape";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../currentItem";
import { DRAW_START_CONFIG_ATOM } from "../drawing";
import { EVENT_ATOM } from "../event";
import { UPDATE_SHAPES_IDS_ATOM } from "../shape";
import TOOL_ATOM, { IShapeTool } from "../tool";
import {
  TOOLS_BOX_BASED,
  TOOLS_DRAW_BASED,
  TOOLS_ICON_BASED,
} from "./constants";
import { CREATE_SHAPE_ATOM } from "./store";
import type { ALL_SHAPES } from "./types";

export const EVENT_DOWN_START_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const tool = get(TOOL_ATOM);

    if (TOOLS_BOX_BASED.includes(tool as (typeof TOOLS_BOX_BASED)[number])) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: atom(tool as IShapeTool),
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
        }),
      ]);
    }

    if (TOOLS_ICON_BASED.includes(tool as (typeof TOOLS_ICON_BASED)[number])) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: atom(tool as IShapeTool),
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
          strokeWidth: atom(1),
          strokeColor: atom("#000000"),
          image: atom({
            src: SVG.Encode(Smile),
            height: 24,
            width: 24,
            name: "smile",
          } as ShapeImage),
        }),
      ]);
    }

    if (TOOLS_DRAW_BASED.includes(tool as (typeof TOOLS_DRAW_BASED)[number])) {
      const drawConfig = get(DRAW_START_CONFIG_ATOM);

      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: atom(tool as IShapeTool),
          points: atom<number[]>([x, y, x, y]),
          label: atom(capitalize(tool)),
          align: atom(get(drawConfig.align)),
          id: uuidv4(),

          x: atom(get(drawConfig.x)),
          y: atom(get(drawConfig.y)),

          fillColor: atom(get(drawConfig.fillColor)),
          strokeColor: atom(get(drawConfig.strokeColor)),
          strokeWidth: atom(get(drawConfig.strokeWidth)),
          lineCap: atom<LineCap>(get(drawConfig.lineCap)),
          lineJoin: atom<LineJoin>(get(drawConfig.lineJoin)),
          shadowColor: atom(get(drawConfig.shadowColor)),
          shadowBlur: atom(get(drawConfig.shadowBlur)),
          shadowOffsetY: atom(get(drawConfig.shadowOffsetY)),
          shadowOffsetX: atom(get(drawConfig.shadowOffsetX)),
          shadowOpacity: atom(get(drawConfig.shadowOpacity)),
          dash: atom(get(drawConfig.dash)),

          offsetX: atom(0),
          copyX: atom(0),
          copyY: atom(0),
          offsetCopyX: atom(0),
          offsetCopyY: atom(0),
          offsetY: atom(0),

          image: atom({
            width: 1200,
            height: 1200,
            name: "default.png",
            src: "/placeholder.svg",
          } as ShapeImage),

          verticalAlign: atom<VerticalAlign>("top"),
          paddingBottom: atom(10),
          paddingTop: atom(10),
          borderBottomLeftRadius: atom(0),
          isAllPadding: atom(true),
          borderBottomRightRadius: atom(0),
          borderTopLeftRadius: atom(0),
          borderTopRightRadius: atom(0),
          paddingLeft: atom(0),
          paddingRight: atom(0),
          padding: atom(0),

          maxHeight: atom(0),
          maxWidth: atom(0),
          minHeight: atom(0),
          minWidth: atom(0),

          isLocked: atom(false),
          fillContainerHeight: atom(false),
          fillContainerWidth: atom(false),
          parentId: atom<string | null>(null),
          rotation: atom(0),
          opacity: atom(1),
          isLayout: atom(false),

          alignItems: atom<AlignItems>("flex-start"),
          flexDirection: atom<FlexDirection>("row"),
          flexWrap: atom<FlexWrap>("nowrap"),
          justifyContent: atom<JustifyContent>("flex-start"),
          gap: atom(0),

          visible: atom(true),
          height: atom(100),
          width: atom(100),

          isAllBorderRadius: atom(true),
          borderRadius: atom(0),

          fontStyle: atom("Roboto"),
          textDecoration: atom("none"),
          fontWeight: atom<FontWeight>("normal"),
          fontFamily: atom("Roboto"),
          fontSize: atom(24),
          text: atom("Hello World"),

          children: atom<ALL_SHAPES[]>([]),
        }),
      ]);
    }

    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "CREATING");
  },
);

export const EVENT_DOWN_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const currentItems = get(CURRENT_ITEM_ATOM);

    currentItems.forEach((item) => {
      const newHeight = isNotNegative(y - Number(get(item.y)));
      const newWidth = isNotNegative(x - Number(get(item.x)));
      const tool = get(item.tool);

      if (TOOLS_BOX_BASED.includes(tool as (typeof TOOLS_BOX_BASED)[number])) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_ICON_BASED.includes(tool as (typeof TOOLS_ICON_BASED)[number])) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_DRAW_BASED.includes(tool as (typeof TOOLS_DRAW_BASED)[number])) {
        set(item.points, get(item.points).concat(x, y));
      }
    });
  },
);

export const EVENT_DOWN_FINISH_SHAPES = atom(null, (get, set) => {
  const currentItems = get(CURRENT_ITEM_ATOM);

  currentItems.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, newShape);
  });

  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      currentItems.map((item) => ({
        id: item.id,
        parentId: get(item.parentId),
      })),
    );
  });

  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});
