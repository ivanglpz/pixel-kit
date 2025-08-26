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

    const childrenStates = children.map((child) => {
      const state = get(
        child.props.shape.state as PrimitiveAtom<IShape> &
          WithInitialValue<IShape>
      );
      return { state, atom: child.props.shape.state };
    });

    const lines = groupIntoLines(
      childrenStates.map(({ state }) => state),
      flexDirection,
      flexWrap,
      effectiveWidth,
      effectiveHeight,
      gap
    );

    // Posicionar cada línea
    let accumulatedCross = padding;

    lines.forEach((line, lineIndex) => {
      const { startMain, spacing } = computeMainLayout(
        justifyContent,
        flexDirection,
        effectiveWidth,
        effectiveHeight,
        line,
        gap
      );

      let accumulatedMain = startMain + padding;

      // Calcular la altura/anchura máxima de la línea para el cross-axis
      const lineMaxCross = Math.max(
        ...line.map((child) =>
          flexDirection === "row" ? child.height : child.width
        )
      );

      line.forEach((childState) => {
        const cross = computeCross(
          alignItems,
          flexDirection,
          effectiveWidth,
          effectiveHeight,
          childState,
          lineMaxCross
        );

        const newWidth = childState.fillContainerWidth
          ? flexDirection === "row"
            ? (effectiveWidth - gap * (line.length - 1)) / line.length
            : effectiveWidth
          : childState.width;

        const newHeight = childState.fillContainerHeight
          ? flexDirection === "column"
            ? (effectiveHeight - gap * (line.length - 1)) / line.length
            : effectiveHeight
          : childState.height;

        const x =
          flexDirection === "row" ? accumulatedMain : accumulatedCross + cross;

        const y =
          flexDirection === "row" ? accumulatedCross + cross : accumulatedMain;

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

      // Mover al siguiente línea en el cross-axis
      accumulatedCross += lineMaxCross + gap;
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

  children.forEach((child, index) => {
    const childSize = flexDirection === "row" ? child.width : child.height;
    const gapSize = currentLine.length > 0 ? gap : 0;
    const totalSizeWithChild = currentSize + childSize + gapSize;

    // Si excede el límite y no es el primer elemento de la línea, crear nueva línea
    if (totalSizeWithChild > limit && currentLine.length > 0) {
      lines.push([...currentLine]);
      currentLine = [child];
      currentSize = childSize;
    } else {
      currentLine.push(child);
      currentSize = totalSizeWithChild;
    }
  });

  // Agregar la última línea si tiene elementos
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

  const totalChildrenSize = children.reduce((sum, child) => {
    const childSize = flexDirection === "row" ? child.width : child.height;
    return sum + childSize;
  }, 0);

  const totalGapSize = Math.max(children.length - 1, 0) * gap;
  const totalContentSize = totalChildrenSize + totalGapSize;
  const freeSpace = mainContainerSize - totalContentSize;

  let startMain = 0;
  let spacing = gap;

  switch (justifyContent) {
    case "center":
      startMain = Math.max(0, freeSpace / 2);
      break;
    case "flex-end":
      startMain = Math.max(0, freeSpace);
      break;
    case "space-between":
      if (children.length > 1) {
        spacing =
          totalChildrenSize > mainContainerSize
            ? gap
            : (mainContainerSize - totalChildrenSize) / (children.length - 1);
        startMain = 0;
      } else {
        startMain = Math.max(0, freeSpace / 2);
      }
      break;
    case "space-around":
      if (children.length > 0) {
        const spacePerChild = Math.max(0, freeSpace / children.length);
        spacing = gap + spacePerChild;
        startMain = spacePerChild / 2;
      }
      break;
    case "flex-start":
    default:
      startMain = 0;
      break;
  }

  return { startMain, spacing };
};

const computeCross = (
  alignItems: AlignItems,
  flexDirection: FlexDirection,
  containerWidth: number,
  containerHeight: number,
  child: IShape,
  lineMaxCross?: number
): number => {
  const crossContainerSize =
    flexDirection === "row" ? containerHeight : containerWidth;
  const childSize = flexDirection === "row" ? child.height : child.width;

  // Para flex wrap, usar el tamaño de la línea en lugar del contenedor completo
  const effectiveCrossSize = lineMaxCross || crossContainerSize;

  switch (alignItems) {
    case "center":
      return Math.max(0, (effectiveCrossSize - childSize) / 2);
    case "flex-end":
      return Math.max(0, effectiveCrossSize - childSize);
    case "flex-start":
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
