import { PrimitiveAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { ALL_SHAPES, SHAPE_BASE_CHILDREN } from "../states/shapes";
import { IShapesKeys } from "../states/tool";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "./layout-flex";

export type WithInitialValue<Value> = {
  init: Value;
};
export type JotaiState<T> = PrimitiveAtom<T> & WithInitialValue<T>;
type FillImage = {
  src: string;
  width: number;
  height: number;
  name: string;
};
export type Fill = {
  id: string;
  color: JotaiState<string>;
  opacity: JotaiState<number>;
  visible: JotaiState<boolean>;
  type: "fill" | "image";
  image: FillImage;
};

export type Stroke = {
  id: string;
  color: JotaiState<string>;
  visible: JotaiState<boolean>;
};

export type Effect = {
  id: string;
  type: "shadow" | "blur" | "glow";
  visible: JotaiState<boolean>;
  color: JotaiState<string>;
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
  label: JotaiState<string>;
  tool: IShapesKeys;
  parentId: JotaiState<string | null>;

  // Position & Transform
  x: JotaiState<number>;
  y: JotaiState<number>;
  copyX: JotaiState<number>;
  copyY: JotaiState<number>;
  offsetX: JotaiState<number>;
  offsetY: JotaiState<number>;
  offsetCopyX: JotaiState<number>;
  offsetCopyY: JotaiState<number>;
  rotation: JotaiState<number>;
  width: JotaiState<number>;
  height: JotaiState<number>;
  points: JotaiState<number[]>;

  // Visibility & Lock
  visible: JotaiState<boolean>;
  isLocked: JotaiState<boolean>;
  opacity: JotaiState<number>;

  // Fill & Stroke
  fills: JotaiState<Fill[]>;
  strokes: JotaiState<Stroke[]>;
  strokeWidth: JotaiState<number>;
  lineCap: JotaiState<LineCap>;
  lineJoin: JotaiState<LineJoin>;
  dash: JotaiState<number>;

  // Effects
  effects: JotaiState<Effect[]>;
  shadowBlur: JotaiState<number>;
  shadowOffsetX: JotaiState<number>;
  shadowOffsetY: JotaiState<number>;
  shadowOpacity: JotaiState<number>;

  // Typography
  text: JotaiState<string>;
  fontFamily: JotaiState<string>;
  fontSize: JotaiState<number>;
  fontStyle: JotaiState<string>;
  fontWeight: JotaiState<FontWeight>;
  textDecoration: JotaiState<string>;
  align: JotaiState<Align>;
  verticalAlign: JotaiState<VerticalAlign>;

  // Layout
  isLayout: JotaiState<boolean>;
  flexDirection: JotaiState<FlexDirection>;
  justifyContent: JotaiState<JustifyContent>;
  alignItems: JotaiState<AlignItems>;
  flexWrap: JotaiState<FlexWrap>;
  // visible: boolean;
  gap: JotaiState<number>;
  fillContainerWidth: JotaiState<boolean>;
  fillContainerHeight: JotaiState<boolean>;

  // Border Radius
  borderRadius: JotaiState<number>;
  isAllBorderRadius: JotaiState<boolean>;
  borderTopLeftRadius: JotaiState<number>;
  borderTopRightRadius: JotaiState<number>;
  borderBottomRightRadius: JotaiState<number>;
  borderBottomLeftRadius: JotaiState<number>;
  minWidth: JotaiState<number>;
  minHeight: JotaiState<number>;
  maxWidth: JotaiState<number>;
  maxHeight: JotaiState<number>;
  isAllPadding: JotaiState<boolean>;
  paddingTop: JotaiState<number>;
  paddingRight: JotaiState<number>;
  paddingBottom: JotaiState<number>;
  paddingLeft: JotaiState<number>;
  padding: JotaiState<number>;
  // Children
  children: JotaiState<ALL_SHAPES[]>;
};

export type IShapeJSON = {
  id: string;
  label: string;
  tool: IShapesKeys;
  parentId: string | null;

  // Position & Transform
  x: number;
  y: number;
  copyX: number;
  copyY: number;
  offsetX: number;
  offsetY: number;
  offsetCopyX: number;
  offsetCopyY: number;
  rotation: number;
  width: number;
  height: number;
  points: number[];

  // Visibility & Lock
  visible: boolean;
  isLocked: boolean;
  opacity: number;

  // Fill & Stroke
  fills: Fill[];
  strokes: Stroke[];
  strokeWidth: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  dash: number;

  // Effects
  effects: Effect[];
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;

  // Typography
  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: FontWeight;
  textDecoration: string;
  align: Align;
  verticalAlign: VerticalAlign;

  // Layout
  isLayout: boolean;
  flexDirection: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  flexWrap: FlexWrap;
  // visible: boolean;
  gap: number;
  fillContainerWidth: boolean;
  fillContainerHeight: boolean;

  // Border Radius
  borderRadius: number;
  isAllBorderRadius: boolean;
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  isAllPadding: boolean;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  padding: number;
  // Children
  ///children
  children: SHAPE_BASE_CHILDREN[];
};

export type IShapeEvents = {
  shape: ALL_SHAPES;
};

export type FCShapeWEvents = FC<IShapeEvents>;
