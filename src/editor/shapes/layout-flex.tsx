import { atom, Getter, Setter } from "jotai";
import React from "react";
import { ALL_SHAPES, PLANE_SHAPES_ATOM } from "../states/shapes";
import { JotaiState } from "./type.shape";
import { ShapeBase } from "./types/shape.base";
import { ShapeState } from "./types/shape.state";

export type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around";

export type AlignItems = "flex-start" | "center" | "flex-end";
export type FlexDirection = "row" | "column";
export type FlexWrap = "nowrap" | "wrap";

export type LayoutFlexProps = Pick<
  ShapeBase,
  | "width"
  | "height"
  | "flexDirection"
  | "justifyContent"
  | "alignItems"
  | "flexWrap"
  | "gap"
> & {
  shape: ShapeState;
  children: React.ReactElement[];
};

type ShapeCache = Pick<
  ShapeBase,
  | "flexDirection"
  | "justifyContent"
  | "alignItems"
  | "flexWrap"
  | "gap"
  | "paddingTop"
  | "paddingLeft"
> & {
  effectiveWidth: number;
  effectiveHeight: number;
};

type ChildCache = Pick<
  ShapeBase,
  | "id"
  | "width"
  | "height"
  | "fillContainerWidth"
  | "fillContainerHeight"
  | "minWidth"
  | "minHeight"
  | "maxWidth"
  | "maxHeight"
> & {
  atom: JotaiState<ShapeState>;
  state: ShapeState;
};

export const flexLayoutAtom = atom(null, (get, set, { id }: { id: string }) => {
  const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find((s) => s.id === id);
  if (!FIND_SHAPE) return;

  const shape = get(FIND_SHAPE.state);
  if (!get(shape.isLayout)) return;

  const children = get(shape.children);
  if (children.length === 0) return;

  // Cachear todos los valores del contenedor de una vez
  const containerCache = buildContainerCache(get, shape);
  if (!containerCache) return;

  // Cachear todos los valores de los hijos de una vez
  const childrenCache = buildChildrenCache(get, children);

  // Agrupar en líneas (wrap)
  const lines = groupIntoLines(childrenCache, containerCache);

  // Calcular layout y aplicar posiciones
  applyFlexLayout(set, lines, childrenCache, containerCache);
});

// --- FUNCIONES DE CACHE ---

function buildContainerCache(
  get: Getter,
  shape: ShapeState
): ShapeCache | null {
  const containerWidth = get(shape.width);
  const containerHeight = get(shape.height);

  if (containerWidth === 0 || containerHeight === 0) return null;

  const isAllPadding = get(shape.isAllPadding);
  const padding = get(shape.padding);
  const paddingTop = isAllPadding ? padding : get(shape.paddingTop);
  const paddingRight = isAllPadding ? padding : get(shape.paddingRight);
  const paddingBottom = isAllPadding ? padding : get(shape.paddingBottom);
  const paddingLeft = isAllPadding ? padding : get(shape.paddingLeft);

  return {
    flexDirection: get(shape.flexDirection),
    justifyContent: get(shape.justifyContent),
    alignItems: get(shape.alignItems),
    flexWrap: get(shape.flexWrap),
    gap: get(shape.gap),
    effectiveWidth: containerWidth - paddingLeft - paddingRight,
    effectiveHeight: containerHeight - paddingTop - paddingBottom,
    paddingTop,
    paddingLeft,
  };
}

function buildChildrenCache(get: Getter, children: ALL_SHAPES[]): ChildCache[] {
  return children.map((child) => {
    const state = get(child.state);
    return {
      id: state.id,
      width: get(state.width),
      height: get(state.height),
      fillContainerWidth: get(state.fillContainerWidth),
      fillContainerHeight: get(state.fillContainerHeight),
      minWidth: get(state.minWidth),
      maxWidth: get(state.maxWidth),
      minHeight: get(state.minHeight),
      maxHeight: get(state.maxHeight),
      atom: child.state,
      state,
    };
  });
}

// --- AGRUPAR EN LÍNEAS ---

function groupIntoLines(
  children: ChildCache[],
  cache: ShapeCache
): ChildCache[][] {
  if (cache.flexWrap === "nowrap") return [children];

  const isRow = cache.flexDirection === "row";
  const limit = isRow ? cache.effectiveWidth : cache.effectiveHeight;
  const lines: ChildCache[][] = [];
  let currentLine: ChildCache[] = [];
  let currentSize = 0;

  for (const child of children) {
    const childSize = isRow ? child.width : child.height;
    const gapSize = currentLine.length > 0 ? cache.gap : 0;
    const nextSize = currentSize + childSize + gapSize;

    if (nextSize > limit && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [child];
      currentSize = childSize;
    } else {
      currentLine.push(child);
      currentSize = nextSize;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

// --- APLICAR LAYOUT ---

function applyFlexLayout(
  set: Setter,
  lines: ChildCache[][],
  childrenCache: ChildCache[],
  cache: ShapeCache
): void {
  const isRow = cache.flexDirection === "row";

  // Calcular offset cross inicial para wrap
  const crossOffset = calculateInitialCrossOffset(lines, cache);
  let currentCrossOffset = crossOffset;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const { startMain, spacing } = computeMainLayout(line, cache);
    const maxCrossSize = getMaxCrossSize(line, isRow);

    let accumulatedMain = startMain;

    for (const child of line) {
      const cross = calculateCrossPosition(
        child,
        cache,
        lines.length > 1,
        isRow
      );
      const { width, height } = calculateChildDimensions(child, line, cache);

      const x = isRow
        ? accumulatedMain + cache.paddingLeft
        : cross + currentCrossOffset + cache.paddingLeft;

      const y = isRow
        ? cross + currentCrossOffset + cache.paddingTop
        : accumulatedMain + cache.paddingTop;

      // Aplicar posición y dimensiones
      updateChildPosition(set, child, x, y, width, height);

      accumulatedMain += (isRow ? width : height) + spacing;
    }

    currentCrossOffset +=
      maxCrossSize + (lineIndex < lines.length - 1 ? cache.gap : 0);
  }
}

// --- HELPERS DE CÁLCULO ---

function calculateInitialCrossOffset(
  lines: ChildCache[][],
  cache: ShapeCache
): number {
  if (cache.flexWrap !== "wrap" || lines.length <= 1) return 0;

  const isRow = cache.flexDirection === "row";
  let totalCrossSize = 0;

  for (let i = 0; i < lines.length; i++) {
    const maxCrossSize = getMaxCrossSize(lines[i], isRow);
    totalCrossSize += maxCrossSize + (i > 0 ? cache.gap : 0);
  }

  const availableSpace =
    (isRow ? cache.effectiveHeight : cache.effectiveWidth) - totalCrossSize;

  switch (cache.alignItems) {
    case "center":
      return availableSpace / 2;
    case "flex-end":
      return availableSpace;
    default:
      return 0;
  }
}

function getMaxCrossSize(line: ChildCache[], isRow: boolean): number {
  let max = 0;
  for (const child of line) {
    const size = isRow ? child.height : child.width;
    if (size > max) max = size;
  }
  return max;
}

function calculateCrossPosition(
  child: ChildCache,
  cache: ShapeCache,
  isWrapped: boolean,
  isRow: boolean
): number {
  const alignItems = isWrapped ? "flex-start" : cache.alignItems;
  const crossContainerSize = isRow
    ? cache.effectiveHeight
    : cache.effectiveWidth;
  const childSize = isRow ? child.height : child.width;

  switch (alignItems) {
    case "center":
      return (crossContainerSize - childSize) / 2;
    case "flex-end":
      return crossContainerSize - childSize;
    default:
      return 0;
  }
}

function calculateChildDimensions(
  child: ChildCache,
  line: ChildCache[],
  cache: ShapeCache
): { width: number; height: number } {
  const isRow = cache.flexDirection === "row";

  let width = child.fillContainerWidth
    ? isRow
      ? (cache.effectiveWidth - cache.gap * (line.length - 1)) / line.length
      : cache.effectiveWidth
    : child.width;

  let height = child.fillContainerHeight
    ? !isRow
      ? (cache.effectiveHeight - cache.gap * (line.length - 1)) / line.length
      : cache.effectiveHeight
    : child.height;

  // Aplicar restricciones min/max
  if (child.minWidth > 0) width = Math.max(width, child.minWidth);
  if (child.maxWidth > 0) width = Math.min(width, child.maxWidth);
  if (child.minHeight > 0) height = Math.max(height, child.minHeight);
  if (child.maxHeight > 0) height = Math.min(height, child.maxHeight);

  return { width, height };
}

function computeMainLayout(
  line: ChildCache[],
  cache: ShapeCache
): { startMain: number; spacing: number } {
  const isRow = cache.flexDirection === "row";
  const mainContainerSize = isRow
    ? cache.effectiveWidth
    : cache.effectiveHeight;

  let contentSize = 0;
  for (const child of line) {
    contentSize += isRow ? child.width : child.height;
  }

  const totalGap = Math.max(line.length - 1, 0) * cache.gap;
  const totalSize = contentSize + totalGap;

  let startMain = 0;
  let spacing = cache.gap;

  switch (cache.justifyContent) {
    case "center":
      startMain = (mainContainerSize - totalSize) / 2;
      break;
    case "flex-end":
      startMain = mainContainerSize - totalSize;
      break;
    case "space-between":
      if (line.length > 1) {
        spacing = (mainContainerSize - contentSize) / (line.length - 1);
      }
      break;
    case "space-around":
      spacing = (mainContainerSize - contentSize) / line.length;
      startMain = spacing / 2;
      break;
  }

  return { startMain, spacing };
}

function updateChildPosition(
  set: Setter,
  child: ChildCache,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const shp = child.state;
  set(shp.x, x);
  set(shp.y, y);
  set(shp.width, width);
  set(shp.height, height);
}
