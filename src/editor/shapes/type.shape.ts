import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { ALL_SHAPES } from "../states/shapes";
import { IKeyMethods } from "../states/tool";
import { LayoutFlexProps } from "./layout-flex";

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
  id: string;
  tool: IKeyMethods;
  x: number;
  y: number;
  parentId: string | null;
  isCreating: boolean;
  rotation: number;
  isLocked: boolean;
  label: string;
  fills: Fill[];
  strokes: Stroke[];
  strokeWidth: number;
  effects: Effect[];
  bordersRadius: number[];
  width: number;
  height: number;
  text?: string;
  visible: boolean;
  points?: number[];
  lineCap?: LineCap;
  lineJoin?: LineJoin;
  dash: number;
  opacity: number;
  backgroundColor?: string;
  align: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
  fontSize?: number;
  fontStyle?: string;
  fontFamily?: string;
  textDecoration?: string;
  fontWeight?: "bold" | "normal" | "lighter" | "bolder" | "100" | "900";
  borderRadius?: number;
  isAllBorderRadius?: boolean;
  zIndex?: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
  shadowBlur: number;
  layouts: Omit<LayoutFlexProps, "children" | "width" | "height" | "display">[];
};

export type IShapeWithEvents = {
  shape: ALL_SHAPES;
  listShapes: ALL_SHAPES[];
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
