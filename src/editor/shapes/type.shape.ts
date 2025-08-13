import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { SHAPES_NODES } from "../states/shapes";
import { IKeyMethods } from "../states/tool";

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
  x: number;
  y: number;
  color: string;
  opacity: number;
  blur: number;
};

export type IShape = {
  id: string;
  tool: IKeyMethods;
  x: number;
  y: number;
  parentId: string | null;
  rotation: number;
  isLocked: boolean;
  label: string;
  fills: Fill[];
  strokes: Stroke[];
  strokeWidth: number;
  effects: Effect[];
  bordersRadius: number[];
  width?: number;
  height?: number;
  text?: string;
  visible: boolean;
  isWritingNow: boolean;
  resolution?: "portrait" | "landscape";
  isBlocked: boolean;
  points?: number[];
  // closed?: boolean;
  rotate?: number;
  lineCap?: LineCap;
  lineJoin?: LineJoin;
  fillEnabled?: boolean;
  dashEnabled?: boolean;
  strokeEnabled?: boolean;
  shadowEnabled?: boolean;
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
};

export type IShapeWithEvents = {
  item: SHAPES_NODES;
  SHAPES: SHAPES_NODES[];
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
