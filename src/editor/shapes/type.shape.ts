import { PrimitiveAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { ALL_SHAPES } from "../states/shapes";
import { IShapeTool } from "../states/tool";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "./layout-flex";

export type WithInitialValue<Value> = {
  init: Value;
};

type FillImage = {
  src: string;
  width: number;
  height: number;
  name: string;
};
export type Fill = {
  id: string;
  color: PrimitiveAtom<string>;
  opacity: PrimitiveAtom<number>;
  visible: PrimitiveAtom<boolean>;
  type: "fill" | "image";
  image: FillImage;
};

export type Stroke = {
  id: string;
  color: PrimitiveAtom<string>;
  visible: PrimitiveAtom<boolean>;
};

export type Effect = {
  id: string;
  type: "shadow" | "blur" | "glow";
  visible: PrimitiveAtom<boolean>;
  color: PrimitiveAtom<string>;
};
export type FontWeight =
  | "bold"
  | "normal"
  | "lighter"
  | "bolder"
  | "100"
  | "900";

export type Align = "left" | "center" | "right" | "justify";
export type VerticalAlign = "top" | "middle" | "bottom";

export type IShape = {
  // Identity
  id: string;
  label: PrimitiveAtom<string>;
  tool: IShapeTool;
  parentId: PrimitiveAtom<string | null>;

  // Position & Transform
  x: PrimitiveAtom<number>;
  y: PrimitiveAtom<number>;
  copyX: PrimitiveAtom<number>;
  copyY: PrimitiveAtom<number>;
  offsetX: PrimitiveAtom<number>;
  offsetY: PrimitiveAtom<number>;
  offsetCopyX: PrimitiveAtom<number>;
  offsetCopyY: PrimitiveAtom<number>;
  rotation: PrimitiveAtom<number>;
  width: PrimitiveAtom<number>;
  height: PrimitiveAtom<number>;
  points: PrimitiveAtom<number[]>;

  // Visibility & Lock
  visible: PrimitiveAtom<boolean>;
  isLocked: PrimitiveAtom<boolean>;
  opacity: PrimitiveAtom<number>;

  // Fill & Stroke
  fills: PrimitiveAtom<Fill[]>;
  strokes: PrimitiveAtom<Stroke[]>;
  strokeWidth: PrimitiveAtom<number>;
  lineCap: PrimitiveAtom<LineCap>;
  lineJoin: PrimitiveAtom<LineJoin>;
  dash: PrimitiveAtom<number>;

  // Effects
  effects: PrimitiveAtom<Effect[]>;
  shadowBlur: PrimitiveAtom<number>;
  shadowOffsetX: PrimitiveAtom<number>;
  shadowOffsetY: PrimitiveAtom<number>;
  shadowOpacity: PrimitiveAtom<number>;

  // Typography
  text: PrimitiveAtom<string>;
  fontFamily: PrimitiveAtom<string>;
  fontSize: PrimitiveAtom<number>;
  fontStyle: PrimitiveAtom<string>;
  fontWeight: PrimitiveAtom<FontWeight>;
  textDecoration: PrimitiveAtom<string>;
  align: PrimitiveAtom<Align>;
  verticalAlign: PrimitiveAtom<VerticalAlign>;

  // Layout
  isLayout: PrimitiveAtom<boolean>;
  flexDirection: PrimitiveAtom<FlexDirection>;
  justifyContent: PrimitiveAtom<JustifyContent>;
  alignItems: PrimitiveAtom<AlignItems>;
  flexWrap: PrimitiveAtom<FlexWrap>;
  // visible: boolean;
  gap: PrimitiveAtom<number>;
  fillContainerWidth: PrimitiveAtom<boolean>;
  fillContainerHeight: PrimitiveAtom<boolean>;

  // Border Radius
  borderRadius: PrimitiveAtom<number>;
  isAllBorderRadius: PrimitiveAtom<boolean>;
  borderTopLeftRadius: PrimitiveAtom<number>;
  borderTopRightRadius: PrimitiveAtom<number>;
  borderBottomRightRadius: PrimitiveAtom<number>;
  borderBottomLeftRadius: PrimitiveAtom<number>;
  minWidth: PrimitiveAtom<number>;
  minHeight: PrimitiveAtom<number>;
  maxWidth: PrimitiveAtom<number>;
  maxHeight: PrimitiveAtom<number>;
  isAllPadding: PrimitiveAtom<boolean>;
  paddingTop: PrimitiveAtom<number>;
  paddingRight: PrimitiveAtom<number>;
  paddingBottom: PrimitiveAtom<number>;
  paddingLeft: PrimitiveAtom<number>;
  padding: PrimitiveAtom<number>;
  // Children
  children: PrimitiveAtom<ALL_SHAPES[]>;
};

export type IShapeEvents = {
  shape: ALL_SHAPES;
  options: {
    isLocked: boolean;
    background: string;
  };
};

export type FCShapeWEvents = FC<IShapeEvents>;
