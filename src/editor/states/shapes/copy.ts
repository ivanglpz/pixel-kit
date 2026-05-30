import { atom, type Getter, type PrimitiveAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import type { ShapeBase } from "../../shapes/types/shape.base";
import type { ShapeState } from "../../shapes/types/shape.state";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../currentItem";
import { EVENT_ATOM } from "../event";
import { PAGE_ID_ATOM } from "../pages";
import {
  RESET_SHAPES_IDS_ATOM,
  SELECTED_SHAPES_BY_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "../shape";
import TOOL_ATOM from "../tool";
import {
  asAtom,
  buildLookup,
  computeAncestorOffset,
  type XY,
} from "./helpers";
import { CREATE_SHAPE_ATOM, PLANE_SHAPES_ATOM } from "./store";
import type { ALL_SHAPES } from "./types";

export const cloneStateRecursive =
  (
    get: Getter,
    offsetOf: (id: string | null | undefined) => XY,
    initialArgs: { x: number; y: number },
  ) =>
  (
    shape: ALL_SHAPES,
    parentId: string | null,
    isRoot: boolean,
  ): ShapeState => {
    const state = get(shape.state);
    const newId = uuidv4();

    const originalChildren = get(state.children) ?? [];
    const clonedChildren: ALL_SHAPES[] = originalChildren.map((child) => {
      const childState = cloneStateRecursive(get, offsetOf, initialArgs)(
        child,
        newId,
        false,
      );

      return {
        ...child,
        id: childState.id,
        pageId: get(PAGE_ID_ATOM),
        state: atom(childState),
      } as ALL_SHAPES;
    });

    const x = get(state.x);
    const y = get(state.y);
    const inherited = offsetOf(parentId);

    const rootX = initialArgs.x - x - inherited.x;
    const rootY = initialArgs.y - y - inherited.y;

    const offsetX = initialArgs.x - x;
    const offsetY = initialArgs.y - y;

    const data: ShapeState = Object.fromEntries(
      Object.entries(state).map(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return [key, value];
        }
        if (key === "children") {
          return [key, asAtom<ALL_SHAPES[]>(clonedChildren)];
        }
        if (key === "id") {
          return [key, newId];
        }
        if (key === "tool") {
          return [key, value];
        }
        if (key === "parentId") {
          return [key, asAtom<string | null>(parentId)];
        }
        return [
          key,
          asAtom(get(value as PrimitiveAtom<ShapeBase[keyof ShapeBase]>)),
        ];
      }),
    ) as ShapeState;

    return {
      ...data,
      id: newId,
      x: asAtom(isRoot ? rootX : x),
      y: asAtom(isRoot ? rootY : y),
      copyX: asAtom(isRoot ? x : 0),
      copyY: asAtom(isRoot ? y : 0),
      offsetX: asAtom(isRoot ? offsetX : 0),
      offsetY: asAtom(isRoot ? offsetY : 0),
      offsetCopyX: asAtom(isRoot ? rootX : 0),
      offsetCopyY: asAtom(isRoot ? rootY : 0),
      sourceShapeId: atom(
        get(get(shape.state).isComponent)
          ? get(shape.state).id
          : get(get(shape.state).sourceShapeId),
      ),
      isComponent: atom(false),
    };
  };

export const EVENT_COPY_START_SHAPES = atom(
  null,
  (get, set, initialArgs: { x: number; y: number }) => {
    const plane = get(PLANE_SHAPES_ATOM) ?? [];
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM) ?? [];

    if (plane.length === 0 || selectedIds.length === 0) return [];

    const selectedSet = new Set(selectedIds.map((shape) => shape.id));
    const lookup = buildLookup(plane);
    const offsetOf = computeAncestorOffset(get)(lookup);

    const shapesSelected = plane.filter((shape) => selectedSet.has(shape.id));

    const newShapes = shapesSelected.map((shape) =>
      cloneStateRecursive(get, offsetOf, initialArgs)(
        shape,
        get(get(shape.state).parentId),
        true,
      ),
    );

    set(RESET_SHAPES_IDS_ATOM);
    set(CREATE_CURRENT_ITEM_ATOM, newShapes);
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "COPYING");

    return newShapes;
  },
);

export const EVENT_COPY_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const currentItems = get(CURRENT_ITEM_ATOM);

    currentItems.forEach((item) => {
      set(item.x, args.x - get(item.offsetCopyX));
      set(item.y, args.y - get(item.offsetCopyY));
      set(item.copyX, args.x - get(item.offsetX));
      set(item.copyY, args.y - get(item.offsetY));
    });
  },
);

export const EVENT_COPY_FINISH_SHAPES = atom(null, (get, set) => {
  const currentItems = get(CURRENT_ITEM_ATOM);

  currentItems.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, {
      ...newShape,
      x: newShape.copyX,
      y: newShape.copyY,
    });
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
