import {
  atom,
  type Getter,
  type PrimitiveAtom,
  type Setter,
  type WritableAtom,
} from "jotai";
import type { ShapeBase } from "../../shapes/types/shape.base";
import type { ShapeState } from "../../shapes/types/shape.state";
import type { ALL_SHAPES } from "./types";

type XY = { x: number; y: number };
type Bounds = { width: number; height: number; startX: number; startY: number };
type Point = { x: number; y: number };
type BoundsInside = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const DEFAULT_BOUNDS: Bounds = {
  width: 1000,
  height: 1000,
  startX: 0,
  startY: 0,
};

export const asAtom = <T>(value: T) => atom(value);

const flattenShapes =
  (get: Getter) =>
  (nodes: ALL_SHAPES[]): ALL_SHAPES[] => {
    const walk = (acc: ALL_SHAPES[], node: ALL_SHAPES): ALL_SHAPES[] => {
      const children = get(get(node.state).children);
      const nextAcc = acc.concat([{ ...node }]);

      return children.length === 0
        ? nextAcc
        : children.reduce((all, child) => walk(all, child), nextAcc);
    };

    return nodes.reduce<ALL_SHAPES[]>((acc, node) => walk(acc, node), []);
  };

export const buildPlaneShapes =
  (get: Getter) =>
  (nodes: ALL_SHAPES[]) =>
    flattenShapes(get)(nodes);

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
      const state = get(shape.state);

      const x = get(state.x);
      const y = get(state.y);
      const width = get(state.width);
      const height = get(state.height);

      const stroke = get(state.strokeWidth) || 0;
      const shadowBlur = get(state.shadowBlur) || 0;
      const shadowOffsetX = get(state.shadowOffsetX) || 0;
      const shadowOffsetY = get(state.shadowOffsetY) || 0;

      const visualPad = Math.max(
        stroke / 2,
        shadowBlur + Math.max(Math.abs(shadowOffsetX), Math.abs(shadowOffsetY)),
      );

      return {
        minX: Math.min(acc.minX, x - visualPad),
        minY: Math.min(acc.minY, y - visualPad),
        maxX: Math.max(acc.maxX, x + width + visualPad),
        maxY: Math.max(acc.maxY, y + height + visualPad),
      };
    }, initial);

    return {
      width: Math.ceil(maxX - minX),
      height: Math.ceil(maxY - minY),
      startX: Math.floor(minX),
      startY: Math.floor(minY),
    };
  };

export const buildLookup = (shapes: ALL_SHAPES[]) =>
  new Map(shapes.map((shape) => [shape.id, shape] as const));

export const computeAncestorOffset =
  (get: Getter) =>
  (lookup: Map<string, ALL_SHAPES>) =>
  (id: string | null | undefined): XY => {
    if (!id) return { x: 0, y: 0 };

    let current = lookup.get(id);
    let totalX = 0;
    let totalY = 0;

    while (current) {
      const state = get(current.state);
      totalX += get(state.x);
      totalY += get(state.y);

      const parentId = get(state.parentId);
      current = parentId ? lookup.get(parentId) : undefined;
    }

    return { x: totalX, y: totalY };
  };

export const detachShapeFromTree =
  (get: Getter) =>
  (set: Setter) =>
  (rootAtom: WritableAtom<ALL_SHAPES[], [ALL_SHAPES[]], void>) =>
  (plane: ALL_SHAPES[]) =>
  (shape: ALL_SHAPES): void => {
    const state = get(shape.state);
    const parentId = get(state.parentId);

    if (parentId) {
      const parent = plane.find((node) => node.id === parentId);
      if (!parent) return;

      const parentChildrenAtom = get(parent.state).children;
      set(
        parentChildrenAtom,
        get(parentChildrenAtom).filter((child) => child.id !== shape.id),
      );
      return;
    }

    set(
      rootAtom,
      get(rootAtom).filter((node: ALL_SHAPES) => node.id !== shape.id),
    );
  };

export const attachShapesToTarget =
  (get: Getter) =>
  (set: Setter) =>
  (targetShape: ALL_SHAPES) =>
  (incoming: ALL_SHAPES[]): void => {
    const targetChildrenAtom = get(targetShape.state).children;

    const existing = get(targetChildrenAtom);
    const existingIds = new Set(existing.map((child) => child.id));

    const toAppend = incoming.filter(
      (shape) => !existingIds.has(shape.id) && shape.id !== targetShape.id,
    );

    set(targetChildrenAtom, existing.concat(toAppend));
  };

export const relocateShapeTree =
  (get: Getter) =>
  (set: Setter) =>
  (
    shape: ALL_SHAPES,
    newParentId: string | null,
    offset: XY,
    adjustSelf: boolean,
  ): ALL_SHAPES => {
    const state = get(shape.state);

    const baseX = get(state.x);
    const baseY = get(state.y);

    const nextX = adjustSelf ? baseX - offset.x : baseX;
    const nextY = adjustSelf ? baseY - offset.y : baseY;

    set(state.x, nextX);
    set(state.y, nextY);
    set(state.parentId, newParentId);

    const children = get(state.children);
    children.forEach((child) =>
      relocateShapeTree(get)(set)(child, shape.id, offset, false),
    );

    return shape;
  };

export const cloneRuntimeShape =
  (get: Getter) =>
  (shape: ALL_SHAPES): ALL_SHAPES => {
    const state = get(shape.state);

    const clonedChildren = get(state.children).map(cloneRuntimeShape(get));

    const clonedState: ShapeState = {
      ...Object.fromEntries(
        Object.entries(state).map(([key, value]) => {
          if (key === "children") return [key, atom(clonedChildren)];
          if (key === "parentId") return [key, atom(get(state.parentId))];
          if (typeof value === "object" && value && "read" in value) {
            return [key, atom(get(value as PrimitiveAtom<unknown>))];
          }
          return [key, value];
        }),
      ),
      id: state.id,
      tool: state.tool,
    } as ShapeState;

    return {
      id: shape.id,
      state: atom(clonedState),
    };
  };

export const isPointInsideBounds = (point: Point, bounds: BoundsInside) =>
  point.x >= bounds.x &&
  point.x <= bounds.x + bounds.width &&
  point.y >= bounds.y &&
  point.y <= bounds.y + bounds.height;

export type { Bounds, Point, XY };
