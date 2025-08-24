import React from "react";
import { Group, Layer, Rect, Stage } from "react-konva";

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
  padding?: number;
  children: React.ReactElement[];
};

// --- helpers ---
const groupIntoLines = (
  children: React.ReactElement[],
  flexDirection: FlexDirection,
  flexWrap: FlexWrap,
  containerWidth: number,
  containerHeight: number,
  gap: number
): React.ReactElement[][] => {
  if (flexWrap === "nowrap") return [children];

  const limit = flexDirection === "row" ? containerWidth : containerHeight;
  const lines: React.ReactElement[][] = [];
  let currentLine: React.ReactElement[] = [];
  let currentSize = 0;

  children.forEach((child) => {
    const childSize =
      flexDirection === "row" ? child.props.width : child.props.height;
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
  children: React.ReactElement[],
  gap: number
): { startMain: number; spacing: number } => {
  const mainContainerSize =
    flexDirection === "row" ? containerWidth : containerHeight;
  const totalSize =
    children.reduce((sum, child) => {
      const childSize =
        flexDirection === "row" ? child.props.width : child.props.height;
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
            sum +
            (flexDirection === "row" ? child.props.width : child.props.height),
          0
        );
        spacing = (mainContainerSize - contentSize) / (children.length - 1);
      }
      break;
    case "space-around":
      const contentSize = children.reduce(
        (sum, child) =>
          sum +
          (flexDirection === "row" ? child.props.width : child.props.height),
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
  child: React.ReactElement
): number => {
  const crossContainerSize =
    flexDirection === "row" ? containerHeight : containerWidth;
  const childSize =
    flexDirection === "row" ? child.props.height : child.props.width;

  switch (alignItems) {
    case "center":
      return (crossContainerSize - childSize) / 2;
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
  padding = 0,
  children,
}) => {
  if (display !== "flex") return <>{children}</>;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const lines = groupIntoLines(
    children,
    flexDirection,
    flexWrap,
    effectiveWidth,
    effectiveHeight,
    gap
  );

  const positionedChildren: React.ReactElement[] = [];

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

    line.forEach((child) => {
      const cross = computeCross(
        alignItems,
        flexDirection,
        effectiveWidth,
        effectiveHeight,
        child
      );

      const x =
        flexDirection === "row"
          ? accumulatedMain + padding
          : cross + lineIndex * (child.props.width + gap) + padding;
      const y =
        flexDirection === "row"
          ? cross + lineIndex * (child.props.height + gap) + padding
          : accumulatedMain + padding;

      positionedChildren.push(
        React.cloneElement(child, {
          x,
          y,
        })
      );

      accumulatedMain +=
        (flexDirection === "row" ? child.props.width : child.props.height) +
        spacing;
    });
  });

  return <>{positionedChildren}</>;
};

// --- demo ---
// --- demo ---
export default function App() {
  // stage config
  const stageWidth = 1200;
  const stageHeight = 1200;

  // container config
  const containerWidth = 600;
  const containerHeight = 600;
  const flexDirection: "row" | "column" = "column";
  const flexWrap: "nowrap" | "wrap" = "wrap";
  const justifyContent:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around" = "space-around";
  const alignItems: "flex-start" | "center" | "flex-end" = "flex-start";
  const gap = 10;

  // items
  const items = Array.from({ length: 6 }, (_, i) => i);

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
            <Rect key={i} fill="blue" height={140} width={140} />
          ))}
        </FlexContainer>
        <Group x={400} y={400}>
          <FlexContainer
            width={300}
            height={300}
            display="flex"
            flexDirection={"row"}
            flexWrap={"nowrap"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            gap={12}
            padding={2} // padding interno
          >
            {items.map((i) => (
              <Rect key={i} fill="orange" height={20} width={20} />
            ))}
          </FlexContainer>
        </Group>
      </Layer>
    </Stage>
  );
}
