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

type FlexProps = {
  width: number;
  height: number;
  display: "flex";
  flexDirection?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  gap?: number;
  children: React.ReactElement[];
};

const FlexContainer: React.FC<FlexProps> = ({
  width,
  height,
  display,
  flexDirection = "row",
  justifyContent = "flex-start",
  alignItems = "flex-start",
  gap = 10,
  children,
}) => {
  if (display !== "flex") return <>{children}</>;

  const childWidth = 50;
  const childHeight = 50;
  const totalChildren = children.length;

  const mainSize =
    flexDirection === "row"
      ? totalChildren * childWidth + (totalChildren - 1) * gap
      : totalChildren * childHeight + (totalChildren - 1) * gap;

  let startMain = 0;
  let spacing = gap;

  if (justifyContent === "center") {
    startMain = (flexDirection === "row" ? width : height) / 2 - mainSize / 2;
  } else if (justifyContent === "flex-end") {
    startMain = (flexDirection === "row" ? width : height) - mainSize;
  } else if (justifyContent === "space-between" && totalChildren > 1) {
    spacing =
      ((flexDirection === "row" ? width : height) -
        (flexDirection === "row" ? childWidth : childHeight) * totalChildren) /
      (totalChildren - 1);
  } else if (justifyContent === "space-around") {
    spacing =
      ((flexDirection === "row" ? width : height) -
        (flexDirection === "row" ? childWidth : childHeight) * totalChildren) /
      totalChildren;
    startMain = spacing / 2;
  }

  const positionedChildren = children.map((child, index) => {
    const main =
      startMain +
      index * ((flexDirection === "row" ? childWidth : childHeight) + spacing);

    let cross = 0;
    if (alignItems === "center") {
      cross =
        (flexDirection === "row" ? height : width) / 2 -
        (flexDirection === "row" ? childHeight : childWidth) / 2;
    } else if (alignItems === "flex-end") {
      cross =
        (flexDirection === "row" ? height : width) -
        (flexDirection === "row" ? childHeight : childWidth);
    }

    return React.cloneElement(child, {
      x: flexDirection === "row" ? main : cross,
      y: flexDirection === "row" ? cross : main,
      width: childWidth,
      height: childHeight,
    });
  });

  return <>{positionedChildren}</>;
};

export default function App() {
  return (
    <Stage width={800} height={800}>
      <Layer>
        <Rect x={0} y={0} width={400} height={400} fill={"red"} />
        <Rect x={0} y={0} width={200} height={200} fill={"green"} />

        <FlexContainer
          width={200}
          height={200}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
        >
          {[...Array(3)].map((_, i) => (
            <Rect key={i} fill="blue" />
          ))}
        </FlexContainer>
      </Layer>
    </Stage>
  );
}
