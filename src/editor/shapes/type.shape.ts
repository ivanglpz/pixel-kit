import { LineCap, LineJoin } from "konva/lib/Shape";
import { FC } from "react";
import { SHAPES_NODES } from "../states/shapes";
import { IKeyMethods } from "../states/tool";

export type WithInitialValue<Value> = {
  init: Value;
};

export type IShape = {
  id: string;
  tool: IKeyMethods;
  x: number;
  y: number;
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
  backgroundColor?: string;
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
  borderRadiusTopLeft?: number;
  zIndex?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomRight?: number;
  borderRadiusBottomLeft?: number;
  colorText?: string;
  stroke?: string;
  strokeWidth?: number;
  bezier: boolean;
};

export type IShapeWithEvents = {
  item: SHAPES_NODES;
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
