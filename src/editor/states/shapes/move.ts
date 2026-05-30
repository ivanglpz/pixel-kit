import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import { CreateShapeSchema } from "../../helpers/shape-schema";
import { flexLayoutAtom } from "../../shapes/layout-flex";
import type { ShapeState } from "../../shapes/types/shape.state";
import {
  RESET_SHAPES_IDS_ATOM,
  SELECTED_SHAPES_BY_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "../shape";
import type { IShapeTool } from "../tool";
import {
  attachShapesToTarget,
  buildLookup,
  computeAncestorOffset,
  detachShapeFromTree,
  isPointInsideBounds,
  relocateShapeTree,
  type Point,
} from "./helpers";
import { ALL_SHAPES_ATOM, PLANE_SHAPES_ATOM } from "./store";
import type { ALL_SHAPES } from "./types";

export const RESOLVE_DROP_TARGET = atom(null, (get, set, coords: Point) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selected = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (selected.length === 0 || plane.length === 0) return;

  const lookup = buildLookup(plane);
  const offsetOf = computeAncestorOffset(get)(lookup);

  const candidates = plane
    .filter(
      (shape) =>
        !selected.some(
          (selection) =>
            shape.id === selection.id ||
            get(get(shape.state).parentId) === selection.id,
        ),
    )
    .filter(
      (shape) =>
        get(get(shape.state).tool) === "FRAME" &&
        get(get(shape.state).visible) &&
        !get(get(shape.state).isLocked),
    )
    .map((shape) => {
      const state = get(shape.state);
      const localX = get(state.x);
      const localY = get(state.y);
      const width = get(state.width);
      const height = get(state.height);

      const ancestorOffset = offsetOf(get(state.parentId));
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
    .filter((candidate) => isPointInsideBounds(coords, candidate.bounds))
    .sort((a, b) => b.depth - a.depth);

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

  const targetShape = plane.find((shape) => shape.id === targetId);
  if (!targetShape) return;

  const targetChildren = get(get(targetShape.state).children);
  const selectedShapes = plane.filter((shape) =>
    selectedIds.some((selection) => selection.id === shape.id),
  );

  const shapesToMove = selectedShapes.filter(
    (shape) => !targetChildren.some((child) => child.id === shape.id),
  );

  const detacher = detachShapeFromTree(get)(set)(ALL_SHAPES_ATOM)(plane);
  shapesToMove.forEach(detacher);

  const lookup = buildLookup(plane);
  const targetOffset = computeAncestorOffset(get)(lookup)(targetId);

  const relocated = shapesToMove.map((shape) =>
    relocateShapeTree(get)(set)(shape, targetShape.id, targetOffset, true),
  );

  attachShapesToTarget(get)(set)(targetShape)(relocated);

  set(flexLayoutAtom, { id: targetShape.id });
  set(
    UPDATE_SHAPES_IDS_ATOM,
    selectedIds.map((selection) => ({
      ...selection,
      parentId: targetShape.id,
    })),
  );
});

export const MOVE_SHAPES_TO_ROOT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (plane.length === 0 || selectedIds.length === 0) return;
  if (selectedIds.every((selection) => selection.parentId == null)) return;

  const movableShapes = plane.filter((shape) =>
    selectedIds.some((selection) => selection.id === shape.id),
  );
  if (movableShapes.length === 0) return;

  const lookup = buildLookup(plane);
  const offsetOf = computeAncestorOffset(get)(lookup);

  const relocateToRoot = (shape: ALL_SHAPES): ALL_SHAPES => {
    const state = get(shape.state);
    const parentId = get(state.parentId);
    const offset = parentId ? offsetOf(parentId) : { x: 0, y: 0 };

    set(state.x, get(state.x) + offset.x);
    set(state.y, get(state.y) + offset.y);
    set(state.parentId, null);

    get(state.children).forEach((child) =>
      relocateShapeTree(get)(set)(child, shape.id, { x: 0, y: 0 }, false),
    );

    return shape;
  };

  movableShapes.forEach((shape) => {
    const parentId = get(get(shape.state).parentId);
    if (!parentId) return;

    const parent = plane.find((node) => node.id === parentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    set(
      parentChildrenAtom,
      get(parentChildrenAtom).filter((child) => child.id !== shape.id),
    );
  });

  const relocated = movableShapes.map(relocateToRoot);

  set(
    UPDATE_SHAPES_IDS_ATOM,
    selectedIds.map((selection) => ({ ...selection, parentId: null })),
  );
  set(ALL_SHAPES_ATOM, get(ALL_SHAPES_ATOM).concat(relocated));
});

export const GROUP_SHAPES_IN_LAYOUT = atom(null, (get, set) => {
  const plane = get(PLANE_SHAPES_ATOM);
  const selectedRefs = get(SELECTED_SHAPES_BY_IDS_ATOM);

  if (selectedRefs.length === 0) return;

  const selectedIdSet = new Set(selectedRefs.map((selection) => selection.id));
  const selectedShapes = plane.filter((shape) => selectedIdSet.has(shape.id));
  if (selectedShapes.length === 0) return;

  const firstParentId = get(get(selectedShapes[0].state).parentId);
  const allSameParent = selectedShapes.every(
    (shape) => get(get(shape.state).parentId) === firstParentId,
  );
  if (!allSameParent) return;

  const bbox = selectedShapes.reduce(
    (acc, shape) => {
      const state = get(shape.state);
      const x1 = get(state.x);
      const y1 = get(state.y);
      const x2 = x1 + (get(state.width) || 0);
      const y2 = y1 + (get(state.height) || 0);

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

  const reparentIntoLayout = (
    shape: ALL_SHAPES,
    parentId: string,
  ): ALL_SHAPES => {
    const state = get(shape.state);

    set(state.x, get(state.x) - bbox.minX);
    set(state.y, get(state.y) - bbox.minY);
    set(state.parentId, parentId);

    get(state.children).forEach((child) => reparentIntoLayout(child, shape.id));
    return shape;
  };

  const layoutChildren = selectedShapes.map((shape) =>
    reparentIntoLayout(shape, newLayoutId),
  );

  const newLayoutShape: ALL_SHAPES = {
    id: newLayoutId,
    state: atom<ShapeState>({ ...newLayout, children: atom(layoutChildren) }),
  };

  if (firstParentId) {
    const parent = plane.find((shape) => shape.id === firstParentId);
    if (!parent) return;

    const parentChildrenAtom = get(parent.state).children;
    const filtered = get(parentChildrenAtom).filter(
      (child) => !selectedIdSet.has(child.id),
    );
    set(parentChildrenAtom, filtered.concat([newLayoutShape]));
  } else {
    set(
      ALL_SHAPES_ATOM,
      get(ALL_SHAPES_ATOM)
        .filter((shape) => !selectedIdSet.has(shape.id))
        .concat([newLayoutShape]),
    );
  }

  set(RESET_SHAPES_IDS_ATOM);
  set(
    UPDATE_SHAPES_IDS_ATOM,
    [{ id: newLayoutId, parentId: firstParentId }],
  );
});
