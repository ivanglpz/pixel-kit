import { FC } from "react";
import { IKeyMethods } from "../hooks/tool/types";

export type IShape = {
  id: string;
  tool: IKeyMethods;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  visible: boolean;
  resolution?: "portrait" | "landscape";
  isBlocked: boolean;
  points?: number[];
  src?: string;
  rotate?: number;
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
  fontWeight?: number;
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
};

export type IShapeWithEvents = {
  shape: IShape;
  draggable: boolean;
  isSelected: boolean;
  onDragStart: (item: IShape) => void;
  onDragMove: (item: IShape) => void;
  onDragStop: (item: IShape) => void;
  onTransformStop: (item: IShape) => void;
  onClick: (item: IShape) => void;
  screenWidth: number;
  screenHeight: number;
};

export type FCShapeWEvents = FC<IShapeWithEvents>;
