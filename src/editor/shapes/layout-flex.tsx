import { atom, PrimitiveAtom } from "jotai";
import React from "react";
import { PLANE_SHAPES_ATOM } from "../states/shapes";
import { IShape, WithInitialValue } from "./type.shape";

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
  // id: string;
  // visible: boolean;
  gap: number;
  children: React.ReactElement[];
  shape: IShape; // contenedor padre
};

export const flexLayoutAtom = atom(null, (get, set, { id }: { id: string }) => {
  const FIND_SHAPE = get(PLANE_SHAPES_ATOM).find((s) => s.id === id);
  if (!FIND_SHAPE) return;
  const shape = get(
    FIND_SHAPE.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  if (!shape.isLayout) return;

  const children = get(shape.children);
  if (children.length === 0) return;

  const {
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap,
    width: containerWidth,
    height: containerHeight,
  } = shape;

  if (containerWidth === 0 || containerHeight === 0) return;

  // Calcular padding del contenedor
  const paddingTop = shape.isAllPadding ? shape.padding : shape.paddingTop;
  const paddingRight = shape.isAllPadding ? shape.padding : shape.paddingRight;
  const paddingBottom = shape.isAllPadding
    ? shape.padding
    : shape.paddingBottom;
  const paddingLeft = shape.isAllPadding ? shape.padding : shape.paddingLeft;

  const effectiveWidth = containerWidth - paddingLeft - paddingRight;
  const effectiveHeight = containerHeight - paddingTop - paddingBottom;

  const childrenStates = children.map((child) => {
    const state = get(
      child.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
    );
    return { state, atom: child.state };
  });

  const lines = groupIntoLines(
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
      ...line.map((child) =>
        flexDirection === "row" ? child.height : child.width
      )
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
      justifyContent,
      flexDirection,
      effectiveWidth,
      effectiveHeight,
      line,
      gap
    );

    const maxCrossSize = Math.max(
      ...line.map((child) =>
        flexDirection === "row" ? child.height : child.width
      )
    );

    let accumulatedMain = startMain;

    line.forEach((childState) => {
      const cross =
        flexWrap === "wrap" && lines.length > 1
          ? computeCross(
              "flex-start",
              flexDirection,
              effectiveWidth,
              effectiveHeight,
              childState
            )
          : computeCross(
              alignItems,
              flexDirection,
              effectiveWidth,
              effectiveHeight,
              childState
            );

      // Ajustar width y height con min/max de los hijos
      let newWidth = childState.fillContainerWidth
        ? flexDirection === "row"
          ? (effectiveWidth - gap * (line.length - 1)) / line.length
          : effectiveWidth
        : childState.width;

      let newHeight = childState.fillContainerHeight
        ? flexDirection === "column"
          ? (effectiveHeight - gap * (line.length - 1)) / line.length
          : effectiveHeight
        : childState.height;

      if (childState.minWidth > 0)
        newWidth = Math.max(newWidth, childState.minWidth);
      if (childState.maxWidth > 0)
        newWidth = Math.min(newWidth, childState.maxWidth);
      if (childState.minHeight > 0)
        newHeight = Math.max(newHeight, childState.minHeight);
      if (childState.maxHeight > 0)
        newHeight = Math.min(newHeight, childState.maxHeight);

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
        set(childAtom, (prev: IShape) => ({
          ...prev,
          x,
          y,
          width: newWidth,
          height: newHeight,
        }));
      }

      accumulatedMain +=
        (flexDirection === "row" ? newWidth : newHeight) + spacing;
    });

    crossOffset += maxCrossSize + (lineIndex < lines.length - 1 ? gap : 0);
  });
});

// --- helpers ---
const groupIntoLines = (
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

  children.forEach((child, index) => {
    const childSize = flexDirection === "row" ? child.width : child.height;

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
      const childSize = flexDirection === "row" ? child.width : child.height;
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
        const contentSize = children.reduce(
          (sum, child) =>
            sum + (flexDirection === "row" ? child.width : child.height),
          0
        );
        spacing = (mainContainerSize - contentSize) / (children.length - 1);
      }
      break;
    case "space-around":
      const contentSize = children.reduce(
        (sum, child) =>
          sum + (flexDirection === "row" ? child.width : child.height),
        0
      );
      spacing = (mainContainerSize - contentSize) / children.length;
      startMain = spacing / 2;
      break;
  }

  return { startMain, spacing };
};

const computeCross = (
  alignItems: AlignItems,
  flexDirection: FlexDirection,
  containerWidth: number,
  containerHeight: number,
  child: IShape
): number => {
  const crossContainerSize =
    flexDirection === "row" ? containerHeight : containerWidth;
  const childSize = flexDirection === "row" ? child.height : child.width;

  switch (alignItems) {
    case "center":
      return (crossContainerSize - childSize) / 2;
    case "flex-end":
      return crossContainerSize - childSize;
    default:
      return 0;
  }
};
