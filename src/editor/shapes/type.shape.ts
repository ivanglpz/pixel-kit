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
  tool: IShapesKeys;
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
