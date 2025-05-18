import { FC } from "react";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { Atom } from "jotai";
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
  shape: Atom<IShape>;
  draggable: boolean;
  isSelected: boolean;
  onDragStart: (item: IShape) => void;
  onDragMove: (item: IShape) => void;
  onDragStop: (item: IShape) => void;
  onTransformStop: (item: IShape) => void;
  onClick: (item: IShape) => void;
  onDbClick?: (item: IShape) => void;
  screenWidth: number;
  screenHeight: number;
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
