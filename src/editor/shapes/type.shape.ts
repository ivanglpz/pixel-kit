import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { SHAPES_NODES } from "../states/shapes";
import { IKeyMethods } from "../states/tool";

export type WithInitialValue<Value> = {
  init: Value;
};

export type Fill = {
  color: string;
  opacity: number;
  visible: boolean;
};

export type Stroke = {
  color: string;
  visible: boolean;

  // position: "inside" | "outside";
  // opacity: number;
  // style: "solid" | "dashed";
  // width_profile: "solid";
  // join: "normal";
  // frequency: number;
  // wiggle: number;
  // smoothen: number;
  // borderPlacement: "all";
};

export type Effect = {
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
  src?: string;
  closed?: boolean;
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
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  borderRadius?: number;
  isAllBorderRadius?: boolean;
  zIndex?: number;
  colorText?: string;
  stroke?: string;
  bezier: boolean;
};

export type IShapeWithEvents = {
  item: SHAPES_NODES;
  SHAPES: SHAPES_NODES[];
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
