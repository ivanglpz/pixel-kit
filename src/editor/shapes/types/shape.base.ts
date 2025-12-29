// shape.base.ts
import { LineCap, LineJoin } from "konva/lib/Shape";
import { SHAPE_BASE_CHILDREN } from "../../states/shapes";
import { IShapeTool } from "../../states/tool";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../layout-flex";

export type FontWeight =
  | "bold"
  | "normal"
  | "lighter"
  | "bolder"
  | "100"
  | "900";

export type Align = "left" | "center" | "right" | "justify";
export type VerticalAlign = "top" | "middle" | "bottom";

export type ShapeImage = {
  src: string;
  width: number;
  height: number;
  name: string;
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

export type ShapeBase = {
  id: string;
  label: string;
  tool: IShapeTool;
  parentId: string | null;

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
  image: ShapeImage;
  visible: boolean;
  isLocked: boolean;
  opacity: number;
  fillColor: string;

  strokeColor: string;
  strokeWidth: number;
  lineCap: LineCap;
  lineJoin: LineJoin;
  dash: number;

  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;

  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: FontWeight;
  textDecoration: string;
  align: Align;
  verticalAlign: VerticalAlign;

  isLayout: boolean;
  flexDirection: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  flexWrap: FlexWrap;

  gap: number;
  fillContainerWidth: boolean;
  fillContainerHeight: boolean;

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

  children: SHAPE_BASE_CHILDREN[];

  /**
   * @deprecated This property will be removed. Use the new rendering pipeline.
   */
  fills?: Fill[];

  /**
   * @deprecated This property will be removed. Use the new rendering pipeline.
   */
  strokes?: Stroke[];

  /**
   * @deprecated This property will be removed. Use the new rendering pipeline.
   */
  effects?: Effect[];
};
