import React from "react";
import { Layer, Rect, Stage } from "react-konva";

type JustifyContent =
  | "flex-start"
  | "center"
  | "flex-end"
  | "space-between"
  | "space-around";

type AlignItems = "flex-start" | "center" | "flex-end";

type FlexDirection = "row" | "column";

type FlexWrap = "nowrap" | "wrap";

type FlexProps = {
  width: number;
  height: number;
  display: "flex";
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  flexWrap?: FlexWrap;
  gap?: number;
  padding?: number; // nuevo prop
  children: React.ReactElement[];
};

// --- helpers ---
const groupIntoLines = (
  children: React.ReactElement[],
  flexDirection: FlexDirection,
  flexWrap: FlexWrap,
  width: number,
  height: number,
  childWidth: number,
  childHeight: number,
  gap: number
): React.ReactElement[][] => {
  if (flexWrap === "nowrap") return [children];

  const limit = flexDirection === "row" ? width : height;
  const sizePerChild = flexDirection === "row" ? childWidth : childHeight;

  const lines: React.ReactElement[][] = [];
  let currentLine: React.ReactElement[] = [];
  let currentSize = 0;

  children.forEach((child, idx) => {
    const nextSize =
      currentSize + sizePerChild + (currentLine.length > 0 ? gap : 0);

    if (nextSize > limit) {
      lines.push(currentLine);
      currentLine = [];
      currentSize = 0;
    }

    currentLine.push(child);
    currentSize += sizePerChild + (currentLine.length > 1 ? gap : 0);
  });

  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
};

const computeMainLayout = (
  justifyContent: JustifyContent,
  flexDirection: FlexDirection,
  containerWidth: number,
  containerHeight: number,
  totalChildren: number,
  childWidth: number,
  childHeight: number,
  gap: number
): { startMain: number; spacing: number } => {
  let startMain = 0;
  let spacing = gap;
  const mainContainerSize =
    flexDirection === "row" ? containerWidth : containerHeight;
  const childSize = flexDirection === "row" ? childWidth : childHeight;
  const totalSize = totalChildren * childSize + (totalChildren - 1) * gap;

  switch (justifyContent) {
    case "center":
      startMain = mainContainerSize / 2 - totalSize / 2;
      break;
    case "flex-end":
      startMain = mainContainerSize - totalSize;
      break;
    case "space-between":
      if (totalChildren > 1) {
        spacing =
          (mainContainerSize - childSize * totalChildren) / (totalChildren - 1);
      }
      break;
    case "space-around":
      spacing = (mainContainerSize - childSize * totalChildren) / totalChildren;
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
  childWidth: number,
  childHeight: number
): number => {
  const crossContainerSize =
    flexDirection === "row" ? containerHeight : containerWidth;
  const childSize = flexDirection === "row" ? childHeight : childWidth;

  switch (alignItems) {
    case "center":
      return crossContainerSize / 2 - childSize / 2;
    case "flex-end":
      return crossContainerSize - childSize;
    default:
      return 0;
  }
};

const FlexContainer: React.FC<FlexProps> = ({
  width,
  height,
  display,
  flexDirection = "row",
  justifyContent = "flex-start",
  alignItems = "flex-start",
  flexWrap = "nowrap",
  gap = 10,
  padding = 0, // default 0
  children,
}) => {
  if (display !== "flex") return <>{children}</>;

  const childWidth = 50;
  const childHeight = 50;

  // ancho/alto efectivos restando padding
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const lines = groupIntoLines(
    children,
    flexDirection,
    flexWrap,
    effectiveWidth,
    effectiveHeight,
    childWidth,
    childHeight,
    gap
  );

  const positionedChildren: React.ReactElement[] = [];

  lines.forEach((line, lineIndex) => {
    const { startMain, spacing } = computeMainLayout(
      justifyContent,
      flexDirection,
      effectiveWidth,
      effectiveHeight,
      line.length,
      childWidth,
      childHeight,
      gap
    );

    const cross = computeCross(
      alignItems,
      flexDirection,
      effectiveWidth,
      effectiveHeight,
      childWidth,
      childHeight
    );

    line.forEach((child, index) => {
      const main =
        startMain +
        index *
          ((flexDirection === "row" ? childWidth : childHeight) + spacing);

      const x =
        flexDirection === "row"
          ? main + padding
          : cross + lineIndex * (childWidth + gap) + padding;
      const y =
        flexDirection === "row"
          ? cross + lineIndex * (childHeight + gap) + padding
          : main + padding;

      positionedChildren.push(
        React.cloneElement(child, {
          x,
          y,
          width: childWidth,
          height: childHeight,
        })
      );
    });
  });

  return <>{positionedChildren}</>;
};

// --- demo ---
// --- demo ---
export default function App() {
  // stage config
  const stageWidth = 800;
  const stageHeight = 800;

  // container config
  const containerWidth = 300;
  const containerHeight = 300;
  const flexDirection: "row" | "column" = "row";
  const flexWrap: "nowrap" | "wrap" = "nowrap";
  const justifyContent:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around" = "flex-start";
  const alignItems: "flex-start" | "center" | "flex-end" = "flex-start";
  const gap = 10;

  // items
  const items = Array.from({ length: 4 }, (_, i) => i);

  return (
    <Stage width={stageWidth} height={stageHeight}>
      <Layer>
        <FlexContainer
          width={containerWidth}
          height={containerHeight}
          display="flex"
          flexDirection={flexDirection}
          flexWrap={flexWrap}
          justifyContent={justifyContent}
          alignItems={alignItems}
          gap={gap}
          padding={gap} // padding interno
        >
          {items.map((i) => (
            <Rect key={i} fill="blue" />
          ))}
        </FlexContainer>
      </Layer>
    </Stage>
  );
}
