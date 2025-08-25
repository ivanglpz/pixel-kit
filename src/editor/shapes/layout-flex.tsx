import { atom, PrimitiveAtom, useAtom } from "jotai";
import React, { useEffect } from "react";
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
  id: string;
  visible: boolean;
  gap: number;
  padding: number;
  children: React.ReactElement[];
};

// Átomo para calcular y aplicar el layout flex
const flexLayoutAtom = atom(
  null,
  (
    get,
    set,
    {
      children,
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      containerWidth,
      containerHeight,
      gap,
      padding,
    }: {
      children: React.ReactElement[];
      flexDirection: FlexDirection;
      justifyContent: JustifyContent;
      alignItems: AlignItems;
      flexWrap: FlexWrap;
      containerWidth: number;
      containerHeight: number;
      gap: number;
      padding: number;
    }
  ) => {
    const effectiveWidth = containerWidth - padding * 2;
    const effectiveHeight = containerHeight - padding * 2;

    // Obtener los estados actuales de los children
    const childrenStates = children.map((child) => {
      const state = get(
        child.props.shape.state as PrimitiveAtom<IShape> &
          WithInitialValue<IShape>
      );
      return { state, atom: child.props.shape.state };
    });
    console.log(childrenStates, "children");

    // Agrupar en líneas si hay wrap
    const lines = groupIntoLines(
      childrenStates.map(({ state }) => state),
      flexDirection,
      flexWrap,
      effectiveWidth,
      effectiveHeight,
      gap
    );

    // Calcular posiciones para cada línea
    lines.forEach((line, lineIndex) => {
      const { startMain, spacing } = computeMainLayout(
        justifyContent,
        flexDirection,
        effectiveWidth,
        effectiveHeight,
        line,
        gap
      );

      let accumulatedMain = startMain;

      line.forEach((childState) => {
        const cross = computeCross(
          alignItems,
          flexDirection,
          effectiveWidth,
          effectiveHeight,
          childState
        );

        const x =
          flexDirection === "row"
            ? accumulatedMain + padding
            : cross + lineIndex * (childState.width + gap) + padding;
        const y =
          flexDirection === "row"
            ? cross + lineIndex * (childState.height + gap) + padding
            : accumulatedMain + padding;

        // Encontrar el átomo correspondiente y actualizar su estado
        const childAtom = childrenStates.find(
          ({ state }) => state.id === childState.id
        )?.atom;
        if (childAtom) {
          set(childAtom, (prev: IShape) => ({
            ...prev,
            x,
            y,
          }));
        }

        accumulatedMain +=
          (flexDirection === "row" ? childState.width : childState.height) +
          spacing;
      });
    });
  }
);

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

  children.forEach((child) => {
    console.log(child, "child");

    const childSize = flexDirection === "row" ? child.width : child.height;
    const nextSize =
      currentSize + childSize + (currentLine.length > 0 ? gap : 0);

    if (nextSize > limit) {
      lines.push(currentLine);
      currentLine = [];
      currentSize = 0;
    }

    currentLine.push(child);
    currentSize += childSize + (currentLine.length > 1 ? gap : 0);
  });

  if (currentLine.length > 0) lines.push(currentLine);
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

export const LayoutFlex: React.FC<LayoutFlexProps> = ({
  width,
  height,
  display,
  flexDirection = "row",
  justifyContent = "flex-start",
  alignItems = "flex-start",
  flexWrap = "nowrap",
  gap = 10,
  padding = 0,
  children,
}) => {
  const [, applyLayout] = useAtom(flexLayoutAtom);

  // Aplicar el layout cada vez que cambien las props o children
  useEffect(() => {
    if (display === "flex" && children.length > 0) {
      applyLayout({
        children,
        flexDirection,
        justifyContent,
        alignItems,
        flexWrap,
        containerWidth: width,
        containerHeight: height,
        gap,
        padding,
      });
    }
  }, [
    children,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    width,
    height,
    gap,
    padding,
    display,
    applyLayout,
  ]);

  // Si no es flex, retornar children sin modificar
  if (display !== "flex") return <>{children}</>;

  // Retornar children sin modificar ya que las posiciones se actualizan via Jotai
  return <>{children}</>;
};
