import { atom, Getter, Setter } from "jotai";
import React from "react";
import { PLANE_SHAPES_ATOM } from "../states/shapes";
import { IShape } from "./type.shape";

export type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around";

export type AlignItems = "flex-start" | "center" | "flex-end";

export type FlexDirection = "row" | "column";

export type FlexWrap = "nowrap" | "wrap";

export type LayoutFlexProps = {
  width: number;
  height: number;
  display: "flex";
  flexDirection: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  flexWrap: FlexWrap;
  gap: number;
  children: React.ReactElement[];
  shape: IShape;
};

export const flexLayoutAtom = atom(null, (get, set, { id }: { id: string }) => {
  const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find((s) => s.id === id);
  if (!FIND_SHAPE) return;
  const shape = get(FIND_SHAPE.state);

  const isLayout = get(shape.isLayout);
  if (!isLayout) return;

  const children = get(shape.children);
  if (children.length === 0) return;

  const flexDirection = get(shape.flexDirection);
  const justifyContent = get(shape.justifyContent);
  const alignItems = get(shape.alignItems);
  const flexWrap = get(shape.flexWrap);
  const gap = get(shape.gap);
  const containerWidth = get(shape.width);
  const containerHeight = get(shape.height);

  if (containerWidth === 0 || containerHeight === 0) return;

  const isAllPadding = get(shape.isAllPadding);
  const padding = get(shape.padding);

  // Calcular padding del contenedor
  const paddingTop = isAllPadding ? padding : get(shape.paddingTop);
  const paddingRight = isAllPadding ? padding : get(shape.paddingRight);
  const paddingBottom = isAllPadding ? padding : get(shape.paddingBottom);
  const paddingLeft = isAllPadding ? padding : get(shape.paddingLeft);

  const effectiveWidth = containerWidth - paddingLeft - paddingRight;
  const effectiveHeight = containerHeight - paddingTop - paddingBottom;

  const childrenStates = children.map((child) => {
    const state = get(child.state);
    return { state, atom: child.state };
  });

  const lines = groupIntoLines(get, set)(
    childrenStates.map(({ state }) => state),
    flexDirection,
    flexWrap,
    effectiveWidth,
    effectiveHeight,
    gap
  );

  let totalCrossSize = 0;
  lines.forEach((line, index) => {
    const maxCrossSize = Math.max(
      ...line.map((child) => {
        const height = get(child.height);
        const width = get(child.width);
        return flexDirection === "row" ? height : width;
      })
    );
    totalCrossSize += maxCrossSize + (index > 0 ? gap : 0);
  });

  let initialCrossOffset = 0;
  if (flexWrap === "wrap" && lines.length > 1) {
    const availableCrossSpace =
      (flexDirection === "row" ? effectiveHeight : effectiveWidth) -
      totalCrossSize;
    switch (alignItems) {
      case "center":
        initialCrossOffset = availableCrossSpace / 2;
        break;
      case "flex-end":
        initialCrossOffset = availableCrossSpace;
        break;
    }
  }

  let crossOffset = initialCrossOffset;

  lines.forEach((line, lineIndex) => {
    const { startMain, spacing } = computeMainLayout(
      get,
      justifyContent,
      flexDirection,
      effectiveWidth,
      effectiveHeight,
      line,
      gap
    );

    const maxCrossSize = Math.max(
      ...line.map((child) => {
        const height = get(child.height);
        const width = get(child.width);
        return flexDirection === "row" ? height : width;
      })
    );

    let accumulatedMain = startMain;

    line.forEach((childState) => {
      const cross =
        flexWrap === "wrap" && lines.length > 1
          ? computeCross(
              get,
              "flex-start",
              flexDirection,
              effectiveWidth,
              effectiveHeight,
              childState
            )
          : computeCross(
              get,
              alignItems,
              flexDirection,
              effectiveWidth,
              effectiveHeight,
              childState
            );

      const fillContainerWidth = get(childState.fillContainerWidth);
      const fillContainerHeight = get(childState.fillContainerHeight);
      const childWidth = get(childState.width);
      const childHeight = get(childState.height);
      const minWidth = get(childState.minWidth);
      const maxWidth = get(childState.maxWidth);
      const minHeight = get(childState.minHeight);
      const maxHeight = get(childState.maxHeight);

      // Ajustar width y height con min/max de los hijos
      let newWidth = fillContainerWidth
        ? flexDirection === "row"
          ? (effectiveWidth - gap * (line.length - 1)) / line.length
          : effectiveWidth
        : childWidth;

      let newHeight = fillContainerHeight
        ? flexDirection === "column"
          ? (effectiveHeight - gap * (line.length - 1)) / line.length
          : effectiveHeight
        : childHeight;

      if (minWidth > 0) newWidth = Math.max(newWidth, minWidth);
      if (maxWidth > 0) newWidth = Math.min(newWidth, maxWidth);
      if (minHeight > 0) newHeight = Math.max(newHeight, minHeight);
      if (maxHeight > 0) newHeight = Math.min(newHeight, maxHeight);

      const x =
        flexDirection === "row"
          ? accumulatedMain + paddingLeft
          : cross + crossOffset + paddingLeft;

      const y =
        flexDirection === "row"
          ? cross + crossOffset + paddingTop
          : accumulatedMain + paddingTop;

      const childAtom = childrenStates.find(
        ({ state }) => state.id === childState.id
      )?.atom;
      if (childAtom) {
        const shp = get(childAtom);

        set(shp.x, x);
        set(shp.y, y);
        set(shp.width, newWidth);
        set(shp.height, newHeight);
      }

      accumulatedMain +=
        (flexDirection === "row" ? newWidth : newHeight) + spacing;
    });

    crossOffset += maxCrossSize + (lineIndex < lines.length - 1 ? gap : 0);
  });
});

// --- helpers ---
const groupIntoLines =
  (get: Getter, set: Setter) =>
  (
    children: IShape[],
    flexDirection: FlexDirection,
    flexWrap: FlexWrap,
    containerWidth: number,
    containerHeight: number,
    gap: number
  ): IShape[][] => {
    if (flexWrap === "nowrap") return [children];

    const limit = flexDirection === "row" ? containerWidth : containerHeight;
    const lines: IShape[][] = [];
    let currentLine: IShape[] = [];
    let currentSize = 0;

    children.forEach((child) => {
      const childSize =
        flexDirection === "row" ? get(child.width) : get(child.height);

      // Calcular el tamaño que tendría la línea si agregamos este elemento
      const gapSize = currentLine.length > 0 ? gap : 0;
      const nextSize = currentSize + childSize + gapSize;

      // Si excede el límite y ya hay elementos en la línea actual, crear nueva línea
      if (nextSize > limit && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [child];
        currentSize = childSize;
      } else {
        // Agregar a la línea actual
        currentLine.push(child);
        currentSize = nextSize;
      }
    });

    // No olvidar agregar la última línea
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  };

const computeMainLayout = (
  get: Getter,
  justifyContent: JustifyContent,
  flexDirection: FlexDirection,
  containerWidth: number,
  containerHeight: number,
  children: IShape[],
  gap: number
): { startMain: number; spacing: number } => {
  const mainContainerSize =
    flexDirection === "row" ? containerWidth : containerHeight;

  const totalSize =
    children.reduce((sum, child) => {
      const childSize =
        flexDirection === "row" ? get(child.width) : get(child.height);
      return sum + childSize;
    }, 0) +
    Math.max(children.length - 1, 0) * gap;

  let startMain = 0;
  let spacing = gap;

  switch (justifyContent) {
    case "center":
      startMain = (mainContainerSize - totalSize) / 2;
      break;
    case "flex-end":
      startMain = mainContainerSize - totalSize;
      break;
    case "space-between":
      if (children.length > 1) {
        const contentSize = children.reduce((sum, child) => {
          const size =
            flexDirection === "row" ? get(child.width) : get(child.height);
          return sum + size;
        }, 0);
        spacing = (mainContainerSize - contentSize) / (children.length - 1);
      }
      break;
    case "space-around":
      const contentSize = children.reduce((sum, child) => {
        const size =
          flexDirection === "row" ? get(child.width) : get(child.height);
        return sum + size;
      }, 0);
      spacing = (mainContainerSize - contentSize) / children.length;
      startMain = spacing / 2;
      break;
  }

  return { startMain, spacing };
};

const computeCross = (
  get: Getter,
  alignItems: AlignItems,
  flexDirection: FlexDirection,
  containerWidth: number,
  containerHeight: number,
  child: IShape
): number => {
  const crossContainerSize =
    flexDirection === "row" ? containerHeight : containerWidth;
  const childSize =
    flexDirection === "row" ? get(child.height) : get(child.width);

  switch (alignItems) {
    case "center":
      return (crossContainerSize - childSize) / 2;
    case "flex-end":
      return crossContainerSize - childSize;
    default:
      return 0;
  }
};
