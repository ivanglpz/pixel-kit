// =====================================
// Imports
// =====================================

import { FontWeight, VerticalAlign } from "@/editor/shapes/type.shape";
import { atom, Getter, PrimitiveAtom, Setter } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { Smile } from "lucide-static";
import { v4 as uuidv4 } from "uuid";

import { CreateShapeSchema, isNotNegative } from "../helpers/shape-schema";
import {
  AlignItems,
  FlexDirection,
  flexLayoutAtom,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { ShapeBase, ShapeImage } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { capitalize } from "../utils/capitalize";
import { SVG } from "../utils/svg";

import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "./currentItem";
import { DRAW_START_CONFIG_ATOM } from "./drawing";
import { EVENT_ATOM } from "./event";
import { CURRENT_PAGE, PAGE_ID_ATOM } from "./pages";
import {
  RESET_SHAPES_IDS_ATOM,
  SELECTED_SHAPES_BY_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "./shape";
import TOOL_ATOM, { IKeyTool, IShapeTool } from "./tool";

// =====================================
// Public types
// =====================================

export type WithInitialValue<Value> = {
  init: Value;
};

export type ALL_SHAPES = {
  id: string;
  // tool: IShapeTool;
  // pageId: string | null;
  state: PrimitiveAtom<ShapeState>;
};

export type SHAPE_BASE_CHILDREN = Omit<ALL_SHAPES, "state"> & {
  state: ShapeBase;
};

// =====================================
// Tool typing and constants
// =====================================

type ExcludedKeys = "DRAW" | "MOVE" | "ICON";
type FirstArrayKeys = Exclude<IKeyTool, ExcludedKeys>; // ["IMAGE", "TEXT", "FRAME"]
type SecondArrayKeys = Extract<IKeyTool, "ICON">; // ["ICON"]

type DrawBasedTools = Extract<IKeyTool, "DRAW">;

// Tools that create a rectangular box (frame, image, text).
const TOOLS_BOX_BASED: FirstArrayKeys[] = ["FRAME", "IMAGE", "TEXT"];

// Tools that create an icon-based shape.
const TOOLS_ICON_BASED: SecondArrayKeys[] = ["ICON"];

// Tools that produce a polyline/path through point accumulation.
const TOOLS_DRAW_BASED: DrawBasedTools[] = ["DRAW"];

// Keyboard keys that should trigger deletion behavior.
export const DELETE_KEYS = ["DELETE", "BACKSPACE"];

// =====================================
// Helpers (pure / reusable)
// =====================================

type XY = { x: number; y: number };
type Bounds = { width: number; height: number; startX: number; startY: number };

// Default bounds used when there are no shapes in the scene.
const DEFAULT_BOUNDS: Bounds = {
  width: 1000,
  height: 1000,
  startX: 0,
  startY: 0,
};

// Small helper to keep atom creation consistent.
const asAtom = <T>(value: T) => atom(value);

/**
 * Flattens a hierarchical shape tree into a single array (pre-order traversal).
 * This is useful for "plane" operations (selection, lookup, moving).
 */
const flattenShapes =
  (get: Getter) =>
  (nodes: ALL_SHAPES[]): ALL_SHAPES[] => {
    const walk = (acc: ALL_SHAPES[], node: ALL_SHAPES): ALL_SHAPES[] => {
      const children = get(get(node.state).children);
      const nextAcc = acc.concat([{ ...node }]);

      return children.length === 0
        ? nextAcc
        : children.reduce((a, c) => walk(a, c), nextAcc);
    };

    return nodes.reduce<ALL_SHAPES[]>((acc, n) => walk(acc, n), []);
  };

/**
 * Computes a bounding box that contains all shapes (based on x/y/width/height).
 * Returns DEFAULT_BOUNDS if there are no shapes.
 */
export const computeStageBounds =
  (get: Getter) =>
  (shapes: ALL_SHAPES[]): Bounds => {
    if (shapes.length === 0) return DEFAULT_BOUNDS;

    const initial = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    };

    const { minX, minY, maxX, maxY } = shapes.reduce((acc, shape) => {
      const st = get(shape.state);

      const x = get(st.x);
      const y = get(st.y);
      const w = get(st.width);
      const h = get(st.height);

      const stroke = get(st.strokeWidth) || 0;
      const shadowBlur = get(st.shadowBlur) || 0;
      const shadowOffsetX = get(st.shadowOffsetX) || 0;
      const shadowOffsetY = get(st.shadowOffsetY) || 0;

      const visualPad = Math.max(
        stroke / 2,
        shadowBlur + Math.max(Math.abs(shadowOffsetX), Math.abs(shadowOffsetY)),
      );

      return {
        minX: Math.min(acc.minX, x - visualPad),
        minY: Math.min(acc.minY, y - visualPad),
        maxX: Math.max(acc.maxX, x + w + visualPad),
        maxY: Math.max(acc.maxY, y + h + visualPad),
      };
    }, initial);

    return {
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY),
      startX: Math.floor(minX),
      startY: Math.floor(minY),
    };
  };

/**
 * Creates an O(1) lookup map from shape id -> shape reference.
 */
const buildLookup = (shapes: ALL_SHAPES[]) =>
  new Map(shapes.map((s) => [s.id, s] as const));

/**
 * Sums x/y offsets from a node up through all ancestors.
 * Used to translate between local coordinates and global-like coordinates.
 */
const computeAncestorOffset =
  (get: Getter) =>
  (lookup: Map<string, ALL_SHAPES>) =>
  (id: string | null | undefined): XY => {
    if (!id) return { x: 0, y: 0 };

    let current = lookup.get(id);
    let totalX = 0;
    let totalY = 0;

    while (current) {
      const st = get(current.state);
      totalX += get(st.x);
      totalY += get(st.y);

      const parentId = get(st.parentId);
      current = parentId ? lookup.get(parentId) : undefined;
    }

    return { x: totalX, y: totalY };
  };

/**
 * Checks whether `childId` is contained anywhere inside `candidateAncestor`'s subtree.
 * This protects against invalid moves (e.g. dropping a parent into its own child).
 */
const isDescendantOf =
  (get: Getter) =>
  (candidateAncestor: ALL_SHAPES, childId: string): boolean => {
    const children = get(get(candidateAncestor.state).children);

    if (children.some((c) => c.id === childId)) return true;
    return children.some((c) => isDescendantOf(get)(c, childId));
  };

/**
 * Removes a shape from its current location in the tree.
 * If it has a parent, it is removed from the parent's children list.
 * Otherwise, it is removed from the root shapes atom.
 */
const detachShapeFromTree =
  (get: Getter) =>
  (set: Setter) =>
  (rootAtom: typeof ALL_SHAPES_ATOM) =>
  (plane: ALL_SHAPES[]) =>
  (shape: ALL_SHAPES): void => {
    const st = get(shape.state);
    const parentId = get(st.parentId);

    if (parentId) {
      const parent = plane.find((p) => p.id === parentId);
      if (!parent) return;

      const parentChildrenAtom = get(parent.state).children;
      set(
        parentChildrenAtom,
        get(parentChildrenAtom).filter((c) => c.id !== shape.id),
      );
      return;
    }

    set(
      rootAtom,
      get(rootAtom).filter((s) => s.id !== shape.id),
    );
  };

/**
 * Attaches incoming shapes to a target shape children list,
 * preventing duplicates and preventing self-attachment.
 */
const attachShapesToTarget =
  (get: Getter) =>
  (set: Setter) =>
  (targetShape: ALL_SHAPES) =>
  (incoming: ALL_SHAPES[]): void => {
    const targetChildrenAtom = get(targetShape.state).children;

    const existing = get(targetChildrenAtom);
    const existingIds = new Set(existing.map((c) => c.id));

    const toAppend = incoming.filter(
      (s) => !existingIds.has(s.id) && s.id !== targetShape.id,
    );

    set(targetChildrenAtom, existing.concat(toAppend));
  };

/**
 * Re-parents a shape (and all its descendants) by updating parentId,
 * and optionally adjusting the top-level shape's x/y by a given offset.
 *
 * `adjustSelf` should be true only for the root of the moved subtree,
 * and false for its descendants (they preserve local coordinates).
 */
const relocateShapeTree =
  (get: Getter) =>
  (set: Setter) =>
  (
    shape: ALL_SHAPES,
    newParentId: string | null,
    offset: XY,
    adjustSelf: boolean,
  ): ALL_SHAPES => {
    const st = get(shape.state);

    const baseX = get(st.x);
    const baseY = get(st.y);

    const nextX = adjustSelf ? baseX - offset.x : baseX;
    const nextY = adjustSelf ? baseY - offset.y : baseY;

    set(st.x, nextX);
    set(st.y, nextY);
    set(st.parentId, newParentId);

    const children = get(st.children);
    children.forEach((child) =>
      relocateShapeTree(get)(set)(child, shape.id, offset, false),
    );

    return shape;
  };

// =====================================
// Atoms (names protected)
// =====================================

/**
 * Root list of shapes for the current page.
 * Read: returns CURRENT_PAGE.SHAPES.LIST
 * Write: sets CURRENT_PAGE.SHAPES.LIST
 */
export const ALL_SHAPES_ATOM = atom(
  (get) => get(get(CURRENT_PAGE).SHAPES.LIST),
  (get, set, newTool: ALL_SHAPES[]) => {
    set(get(CURRENT_PAGE).SHAPES.LIST, newTool);
  },
);

/**
 * Computes stage bounds from all root shapes.
 * Note: this is a write-only atom that returns a value in its write function.
 */
export const GET_STAGE_BOUNDS_ATOM = atom(null, (get) => {
  return computeStageBounds(get)(get(ALL_SHAPES_ATOM));
});

/**
 * A flattened view of all shapes in the page (root + descendants).
 */
export const PLANE_SHAPES_ATOM = atom((get) => {
  return flattenShapes(get)(get(ALL_SHAPES_ATOM));
});

/**
 * Deletes currently selected shapes:
 * - If shape has a parent, it is removed from parent's children list.
 * - If shape is root, it is removed from ALL_SHAPES_ATOM.
 * Also clears page SHAPES.ID after deletion.
 */
export const DELETE_SHAPES_ATOM = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selected.length === 0) return;

  selected.forEach((sel) => {
    if (sel.parentId) {
      const parent = plane.find((s) => s.id === sel.parentId);
      if (!parent) return;

      // Ensure layout atoms are synced for this parent before removing children.
      set(flexLayoutAtom, { id: parent.id });

      const childrenAtom = get(parent.state).children;
      const nextChildren = get(childrenAtom).filter((c) => c.id !== sel.id);
      set(childrenAtom, nextChildren);

      // Re-sync to the selected's parent after change.
      set(flexLayoutAtom, { id: sel.parentId });
      return;
    }

    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM).filter((s) => s.id !== sel.id),
    );
  });

  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;
  // const selectedShapes = plane.filter((e) =>
  //   selected.some((w) => w.id === e.id),
  // );

  set(SHAPE_IDS_, []);
  // set(NEW_UNDO_REDO, {
  //   type: "DELETE",
  //   shapes: selectedShapes,
  // });
});

/**
 * Deletes everything in the current page (root shapes + ids).
 */
export const DELETE_ALL_SHAPES_ATOM = atom(null, (get, set) => {
  const SHAPE_IDS_ = get(CURRENT_PAGE).SHAPES.ID;
  const currentShapes = get(PLANE_SHAPES_ATOM);
  set(SHAPE_IDS_, []);
  set(ALL_SHAPES_ATOM, []);
  // set(NEW_UNDO_REDO, {
  //   type: "DELETE",
  //   shapes: currentShapes,
  // });
});

// =====================================
// Movement
// =====================================
const cloneRuntimeShape =
  (get: Getter) =>
  (shape: ALL_SHAPES): ALL_SHAPES => {
    const st = get(shape.state);

    const clonedChildren = get(st.children).map(cloneRuntimeShape(get));

    const clonedState: ShapeState = {
      ...Object.fromEntries(
        Object.entries(st).map(([k, v]) => {
          if (k === "children") return [k, atom(clonedChildren)];
          if (k === "parentId") return [k, atom(get(st.parentId))];
          if (typeof v === "object" && v && "read" in v)
            return [k, atom(get(v as PrimitiveAtom<unknown>))];
          return [k, v];
        }),
      ),
      id: st.id,
      tool: st.tool,
    } as ShapeState;

    return {
      id: shape.id,
      // tool: shape.tool,
      state: atom(clonedState),
    };
  };

/**
 * Moves selected shapes into a target shape (by id), re-parenting and adjusting coordinates.
 * Prevents:
 * - Moving into itself
 * - Moving an ancestor into its descendant
 * - Duplicating children already under the target
 */
type Point = {
  x: number;
  y: number;
};

type BoundsInside = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const isPointInsideBounds = (p: Point, b: BoundsInside): boolean =>
  p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;

export const RESOLVE_DROP_TARGET = atom(null, (get, set, COORDS: Point) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (selected.length === 0 || plane.length === 0) return;
  const lookup = buildLookup(plane);
  const offsetOf = computeAncestorOffset(get)(lookup);

  const candidates = plane
    .filter(
      (shape) =>
        !selected.some(
          (e) => shape.id === e?.id || get(get(shape?.state).parentId) === e.id,
        ),
    )
    .filter((e) => get(get(e.state).tool) === "FRAME")
    .map((shape) => {
      const st = get(shape.state);
      const localX = get(st.x);
      const localY = get(st.y);
      const width = get(st.width);
      const height = get(st.height);

      const ancestorOffset = offsetOf(get(st.parentId));
      const x = localX + ancestorOffset.x;
      const y = localY + ancestorOffset.y;

      return {
        shape,
        bounds: {
          x,
          y,
          width,
          height,
        },
        depth: x + y,
      };
    })
    .filter((c) => isPointInsideBounds(COORDS, c.bounds))
    .sort((a, b) => b.depth - a.depth);
  console.log(candidates, "candidates");

  const target = candidates.length > 0 ? candidates[0].shape : null;

  if (!target) {
    set(MOVE_SHAPES_TO_ROOT);
    return;
  }

  set(MOVE_SHAPES_BY_ID, target.id);
});

export const MOVE_SHAPES_BY_ID = atom(null, (get, set, targetId: string) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selectedIds.length === 0) return;

  const targetShape = plane.find((s) => s.id === targetId);
  if (!targetShape) return;

  const targetChildren = get(get(targetShape.state).children);
  const selectedShapes = plane.filter((s) =>
    selectedIds.some((e) => e.id === s.id),
  );

  const shapesToMove = selectedShapes.filter(
    (s) => !targetChildren.some((e) => e.id === s.id),
  );

  const detacher = detachShapeFromTree(get)(set)(ALL_SHAPES_ATOM)(plane);
  shapesToMove.forEach(detacher);

  const lookup = buildLookup(plane);
  const targetOffset = computeAncestorOffset(get)(lookup)(targetId);

  const relocated = shapesToMove.map((shape) =>
    relocateShapeTree(get)(set)(shape, targetShape.id, targetOffset, true),
  );

  attachShapesToTarget(get)(set)(targetShape)(relocated);

  const nextSelection = selectedIds.map((r) => {
    return { ...r, parentId: targetShape.id };
  });
  set(flexLayoutAtom, { id: targetShape.id });

  set(UPDATE_SHAPES_IDS_ATOM, nextSelection);
});

/**
 * Moves selected shapes to the root level:
 * - Removes them from their previous parent's children list
 * - Adjusts x/y to keep the same visual position (adds ancestor offsets)
 * - Sets parentId to null
 */

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selectedIds.length === 0) return;
  if (selectedIds?.every((e) => e?.parentId == null)) {
    return;
  }

  const movableShapes = plane.filter((shape) =>
    selectedIds.some((e) => e?.id === shape.id),
  );
  if (movableShapes.length === 0) return;

  const clone = cloneRuntimeShape(get);
  const prevSelectedShapes = movableShapes.map(clone);

  const lookup = buildLookup(plane);
  const offsetOf = computeAncestorOffset(get)(lookup);

  const relocateToRoot = (shape: ALL_SHAPES): ALL_SHAPES => {
    const st = get(shape.state);

    // Calcula offset absoluto de la jerarquía completa
    const parentId = get(st.parentId);
    const offset = parentId ? offsetOf(parentId) : { x: 0, y: 0 };

    // Ajusta posición del shape raíz
    set(st.x, get(st.x) + offset.x);
    set(st.y, get(st.y) + offset.y);
    set(st.parentId, null);

    // Ajusta posiciones de todos los descendientes recursivamente
    const children = get(st.children);
    children.forEach((child) =>
      relocateShapeTree(get)(set)(child, shape.id, { x: 0, y: 0 }, false),
    );

    return shape;
  };

  movableShapes.forEach((shape) => {
    const parentId = get(get(shape.state).parentId);
    if (!parentId) return;

    const parent = plane.find((s) => s.id === parentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    set(
      parentChildrenAtom,
      get(parentChildrenAtom).filter((c) => c.id !== shape.id),
    );
  });

  const relocated = movableShapes.map(relocateToRoot);

  set(
    UPDATE_SHAPES_IDS_ATOM,
    selectedIds.map((r) => ({ ...r, parentId: null })),
  );

  set(ALL_SHAPES_ATOM, get(ALL_SHAPES_ATOM).concat(relocated));

  // set(NEW_UNDO_REDO, {
  //   type: "MOVE",
  //   shapes: relocated,
  //   prevShapes: prevSelectedShapes,
  // });
});

/**
 * Creates a new "layout" frame that groups selected shapes under the same parent.
 * Requirements:
 * - At least 1 selected shape
 * - All selected shapes share the same parentId
 * Behavior:
 * - Computes bounding box of selection
 * - Creates a new FRAME shape sized to that bbox
 * - Re-parents selected shapes into the new layout and adjusts their coordinates
 * - Replaces selected shapes in the original parent children list (or root list)
 */
export const GROUP_SHAPES_IN_LAYOUT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (selectedRefs.length === 0) return;

  const selectedIdSet = new Set(selectedRefs.map((r) => r.id));
  const selectedShapes = plane.filter((s) => selectedIdSet.has(s.id));
  if (selectedShapes.length === 0) return;
  const clone = cloneRuntimeShape(get);
  const prevSelectedShapes = selectedShapes.map(clone);
  const firstParentId = get(get(selectedShapes[0].state).parentId);
  const allSameParent = selectedShapes.every(
    (s) => get(get(s.state).parentId) === firstParentId,
  );
  if (!allSameParent) return;

  // Compute bounding box in the parent's local coordinate space.
  const bbox = selectedShapes.reduce(
    (acc, shape) => {
      const st = get(shape.state);

      const x1 = get(st.x);
      const y1 = get(st.y);
      const x2 = x1 + (get(st.width) || 0);
      const y2 = y1 + (get(st.height) || 0);

      return {
        minX: Math.min(acc.minX, x1),
        minY: Math.min(acc.minY, y1),
        maxX: Math.max(acc.maxX, x2),
        maxY: Math.max(acc.maxY, y2),
      };
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );

  const newLayoutId = uuidv4();

  // Create the layout container with bbox dimensions.
  const newLayout = CreateShapeSchema({
    tool: atom<IShapeTool>("FRAME"),
    x: atom(bbox.minX),
    y: atom(bbox.minY),
    width: atom(bbox.maxX - bbox.minX),
    height: atom(bbox.maxY - bbox.minY),
    label: atom("LAYOUT"),
    isLayout: atom(false),
    id: newLayoutId,
    parentId: atom(firstParentId),
    fillColor: atom("transparent"),
  });

  // Re-parent each selected shape into the new layout; translate into layout-local coordinates.
  const reparentIntoLayout = (
    shape: ALL_SHAPES,
    parentId: string,
  ): ALL_SHAPES => {
    const st = get(shape.state);

    set(st.x, get(st.x) - bbox.minX);
    set(st.y, get(st.y) - bbox.minY);
    set(st.parentId, parentId);

    get(st.children).forEach((c) => reparentIntoLayout(c, shape.id));
    return shape;
  };

  const layoutChildren = selectedShapes.map((s) =>
    reparentIntoLayout(s, newLayoutId),
  );

  const newLayoutShape: ALL_SHAPES = {
    id: newLayoutId,
    // tool: "FRAME",
    state: atom<ShapeState>({ ...newLayout, children: atom(layoutChildren) }),
  };

  // Replace selected shapes with the new layout under the same original parent/root.
  if (firstParentId) {
    const parent = plane.find((s) => s.id === firstParentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    const filtered = get(parentChildrenAtom).filter(
      (c) => !selectedIdSet.has(c.id),
    );
    set(parentChildrenAtom, filtered.concat([newLayoutShape]));
  } else {
    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM)
        .filter((s) => !selectedIdSet.has(s.id))
        .concat([newLayoutShape]),
    );
  }

  // Reset selection and select only the new layout.
  set(RESET_SHAPES_IDS_ATOM);
  set(UPDATE_SHAPES_IDS_ATOM, [{ id: newLayoutId, parentId: firstParentId }]);
  // set(NEW_UNDO_REDO, {
  //   type: "GROUPING",
  //   shapes: [newLayoutShape], // Estado DESPUÉS (el layout con los hijos)
  //   prevShapes: prevSelectedShapes, // Estado ANTES (los elementos individuales)
  // });
});

// =====================================
// Copy shapes
// =====================================

/**
 * Starts a copy operation:
 * - Clones selected shapes recursively (new ids)
 * - Computes offsets so the copy follows the cursor
 * - Stores cloned shapes in CURRENT_ITEM_ATOM (via CREATE_CURRENT_ITEM_ATOM)
 * - Switches tool/event into "COPYING" state
 */
export const EVENT_COPY_START_SHAPES = atom(
  null,
  (get, set, initial_args: { x: number; y: number }) => {
    const plane = get(PLANE_SHAPES_ATOM) ?? [];
    const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM) ?? [];

    if (plane.length === 0 || selectedIds.length === 0) return [];

    const selectedSet = new Set(selectedIds.map((s) => s.id));
    const lookup = buildLookup(plane);
    const offsetOf = computeAncestorOffset(get)(lookup);

    const shapesSelected = plane.filter((s) => selectedSet.has(s.id));

    const cloneStateRecursive = (
      shape: ALL_SHAPES,
      parentId: string | null,
      IS_ROOT: boolean,
    ): ShapeState => {
      const state = get(shape.state);
      const newId = uuidv4();

      // Clone children first so we can link them to the new parent id.
      const originalChildren = get(state.children) ?? [];
      const clonedChildren: ALL_SHAPES[] = originalChildren.map((child) => {
        const childState = cloneStateRecursive(child, newId, false);
        return {
          ...child,
          id: childState.id,
          // tool: childState.tool as IShapeTool,
          pageId: get(PAGE_ID_ATOM),
          state: atom(childState),
        } as ALL_SHAPES;
      });

      // Root shapes get special offsets so they follow the cursor position.
      const x = get(state.x);
      const y = get(state.y);
      const inherited = offsetOf(parentId);

      const rootX = initial_args.x - x - inherited.x;
      const rootY = initial_args.y - y - inherited.y;

      const offsetX = initial_args.x - x;
      const offsetY = initial_args.y - y;

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
      );

      return {
        ...data,
        id: newId,
        x: asAtom(IS_ROOT ? rootX : x),
        y: asAtom(IS_ROOT ? rootY : y),
        offsetX: asAtom(IS_ROOT ? offsetX : 0),
        offsetY: asAtom(IS_ROOT ? offsetY : 0),
        offsetCopyX: asAtom(IS_ROOT ? rootX : 0),
        offsetCopyY: asAtom(IS_ROOT ? rootY : 0),
        sourceShapeId: atom(
          get(get(shape.state).isComponent)
            ? get(shape.state).id
            : get(get(shape.state).sourceShapeId),
        ),
        isComponent: atom(false),
      };
    };

    const newShapes = shapesSelected.map((shape) =>
      cloneStateRecursive(shape, get(get(shape.state).parentId), true),
    );

    set(RESET_SHAPES_IDS_ATOM);
    set(CREATE_CURRENT_ITEM_ATOM, newShapes);
    set(TOOL_ATOM, "MOVE");
    set(EVENT_ATOM, "COPYING");

    return newShapes;
  },
);

/**
 * While copying, updates the in-progress copy positions based on the cursor.
 */
export const EVENT_COPY_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

    CURRENT_ITEMS.forEach((element) => {
      set(element.x, args.x - get(element.offsetCopyX));
      set(element.y, args.y - get(element.offsetCopyY));
      set(element.copyX, args.x - get(element.offsetX));
      set(element.copyY, args.y - get(element.offsetY));
    });
  },
);

/**
 * Finishes copy:
 * - Materializes the copied shapes into the scene via CREATE_SHAPE_ATOM
 * - Updates selection ids after shapes exist
 * - Returns tool/event to idle and clears current items
 */
export const EVENT_COPY_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

  CURRENT_ITEMS.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, {
      ...newShape,
      x: newShape.copyX,
      y: newShape.copyY,
    });
  });

  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS.map((e) => ({ id: e.id, parentId: get(e.parentId) })),
    );
  });

  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});

// =====================================
// Down shapes (mouse down / create)
// =====================================

/**
 * Starts creating a shape on pointer down:
 * - BOX tools: create initial shape with x/y and label
 * - ICON tools: create icon shape with default SVG (Smile)
 * - DRAW tools: create a draw shape with initial points and draw config defaults
 * Then switches tool to MOVE and sets event to CREATING.
 */
export const EVENT_DOWN_START_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const tool = get(TOOL_ATOM);

    if (TOOLS_BOX_BASED.includes(tool as FirstArrayKeys)) {
      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          // tool: tool as ShapeBase["tool"],
          tool: atom(tool as IShapeTool),
          x: atom(x),
          y: atom(y),
          label: atom<string>(tool),
        }),
      ]);
    }

    if (TOOLS_ICON_BASED.includes(tool as SecondArrayKeys)) {
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

    if (TOOLS_DRAW_BASED.includes(tool as DrawBasedTools)) {
      const drawConfig = get(DRAW_START_CONFIG_ATOM);

      set(CREATE_CURRENT_ITEM_ATOM, [
        CreateShapeSchema({
          tool: atom(tool as IShapeTool),
          points: atom<number[]>([x, y, x, y]),
          label: atom(capitalize(tool)),
          align: atom(get(drawConfig.align)),
          id: uuidv4(),

          // Start position is taken from draw config.
          x: atom(get(drawConfig.x)),
          y: atom(get(drawConfig.y)),

          // Style defaults are taken from draw config.
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

          // Copy/move interaction fields default to zero.
          offsetX: atom(0),
          copyX: atom(0),
          copyY: atom(0),
          offsetCopyX: atom(0),
          offsetCopyY: atom(0),
          offsetY: atom(0),

          // Placeholder image until a real one is set.
          image: atom({
            width: 1200,
            height: 1200,
            name: "default.png",
            src: "/placeholder.svg",
          } as ShapeImage),

          // Layout/text defaults.
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

/**
 * While creating a shape (pointer move):
 * - BOX/ICON: update width/height from initial x/y
 * - DRAW: append points
 */
export const EVENT_DOWN_CREATING_SHAPES = atom(
  null,
  (get, set, args: { x: number; y: number }) => {
    const { x, y } = args;
    const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

    CURRENT_ITEMS.forEach((item) => {
      const newHeight = isNotNegative(y - Number(get(item.y)));
      const newWidth = isNotNegative(x - Number(get(item.x)));
      const tool = get(item.tool);

      if (TOOLS_BOX_BASED.includes(tool as FirstArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_ICON_BASED.includes(tool as SecondArrayKeys)) {
        set(item.width, newWidth);
        set(item.height, newHeight);
      }

      if (TOOLS_DRAW_BASED.includes(tool as DrawBasedTools)) {
        set(item.points, get(item.points).concat(x, y));
      }
    });
  },
);

/**
 * Finishes creation:
 * - Materializes each current item into the scene via CREATE_SHAPE_ATOM
 * - Updates selection ids after shapes exist
 * - Returns tool/event to idle and clears current items
 */
export const EVENT_DOWN_FINISH_SHAPES = atom(null, (get, set) => {
  const CURRENT_ITEMS = get(CURRENT_ITEM_ATOM);

  CURRENT_ITEMS.forEach((newShape) => {
    set(CREATE_SHAPE_ATOM, newShape);
  });

  Promise.resolve().then(() => {
    set(
      UPDATE_SHAPES_IDS_ATOM,
      CURRENT_ITEMS.map((e) => ({ id: e.id, parentId: get(e.parentId) })),
    );
  });

  set(TOOL_ATOM, "MOVE");
  set(EVENT_ATOM, "IDLE");
  set(CLEAR_CURRENT_ITEM_ATOM);
});

// =====================================
// Create shape
// =====================================

/**
 * Persists a ShapeState into the scene graph:
 * - If parentId exists, appends under parent's children
 * - Otherwise, appends at the root
 */
export const CREATE_SHAPE_ATOM = atom(null, (get, set, args: ShapeState) => {
  if (!args || !args.id) return;

  // Append as child if there is a parent id.
  if (get(args.parentId)) {
    const parentId = get(args.parentId);
    const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find((e) => e.id === parentId);
    if (!FIND_SHAPE) return;

    const childrenAtom = get(FIND_SHAPE.state).children;
    set(childrenAtom, [
      ...get(childrenAtom),
      {
        id: args.id,
        // tool: args.tool,
        state: atom<ShapeState>(args),
        pageId: get(PAGE_ID_ATOM),
      },
    ]);

    // Trigger flex re-layout for the parent container.
    set(flexLayoutAtom, { id: FIND_SHAPE.id });
    // set(NEW_UNDO_REDO, {
    //   shapes: [
    //     {
    //       ...FIND_SHAPE,
    //       state: atom(args),
    //     },
    //   ],
    //   type: "CREATE",
    // });

    return;
  }

  // Otherwise, append as a root shape.
  const newAllShape: ALL_SHAPES = {
    id: args.id,
    // tool: args.tool,
    state: atom<ShapeState>(args),
  };

  set(ALL_SHAPES_ATOM, [...get(ALL_SHAPES_ATOM), newAllShape]);
  // set(NEW_UNDO_REDO, {
  //   shapes: [newAllShape],
  //   type: "CREATE",
  // });
});

export default ALL_SHAPES_ATOM;
