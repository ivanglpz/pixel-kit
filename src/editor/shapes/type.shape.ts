import { PrimitiveAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { ALL_SHAPES, ALL_SHAPES_CHILDREN } from "../states/shapes";
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
  color: string;
  opacity: number;
  visible: boolean;
  type: "fill" | "image";
  image: FillImage;
};

export type Stroke = {
  id: string;
  color: string;
  visible: boolean;
};

export type Effect = {
  id: string;
  type: "shadow" | "blur" | "glow";
  visible: boolean;
  color: string;
};

export type IShape = {
  // Identity
  id: string;
  label: string;
  tool: IShapesKeys;
  parentId: string | null;

  // Position & Transform
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
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
  fontWeight: "bold" | "normal" | "lighter" | "bolder" | "100" | "900";
  textDecoration?: string;
  align: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";

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
  children: PrimitiveAtom<ALL_SHAPES[]> & WithInitialValue<ALL_SHAPES[]>;
};

export type IShapeChildren = Omit<IShape, "children"> & {
  children: ALL_SHAPES_CHILDREN[];
};

export type IShapeEvents = {
  shape: ALL_SHAPES;
};

export type FCShapeWEvents = FC<IShapeEvents>;
