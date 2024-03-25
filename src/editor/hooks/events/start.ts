import { v4 as uuidv4 } from "uuid";
import { IKeyMethods } from "../tool/types";
import { IShape } from "@/editor/shapes/type.shape";
import { LineCap, LineJoin } from "konva/lib/Shape";

type ShapeStartProps = {
  x: number;
  y: number;
  tool: IKeyMethods;
  text?: string;
  image?: string;
  height?: number;
  width?: number;
  points?: number[];
  stroke?: string;
  strokeWidth?: number;
  lineCap?: LineCap;
  lineJoin?: LineJoin;
  dash?: number;
  dashEnable?: boolean;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowEnabled?: boolean;
  shadowOpacity?: number;
  closed?: boolean;
  isWritingNow?: boolean;
};

export const shapeStart = (props: ShapeStartProps): IShape => {
  const {
    tool,
    x,
    y,
    image,
    height,
    text,
    width,
    points,
    stroke,
    strokeWidth,
    lineCap,
    lineJoin,
    dash,
    dashEnable,
    shadowBlur,
    shadowColor,
    shadowEnabled,
    shadowOffsetX,
    shadowOffsetY,
    shadowOpacity,
    closed,
    isWritingNow,
  } = props;
  return {
    id: uuidv4(),
    x,
    y,
    isBlocked: false,
    tool: tool,
    isWritingNow: isWritingNow ?? true,
    fillEnabled: true,
    strokeEnabled: true,
    visible: true,
    rotate: 0,
    height: height ?? 1,
    width: width ?? 1,
    stroke: stroke ?? "#ffffff",
    points: points ?? [],
    strokeWidth: strokeWidth ?? 0,
    backgroundColor: "#ffffff",
    lineCap: lineCap ?? "round",
    lineJoin: lineJoin ?? "round",
    shadowBlur: shadowBlur ?? 0,
    shadowColor: shadowColor ?? "#ffffff",
    shadowOffsetY: shadowOffsetY ?? 0,
    shadowOffsetX: shadowOffsetX ?? 0,
    shadowEnabled: shadowEnabled ?? true,
    shadowOpacity: shadowOpacity ?? 1,
    isAllBorderRadius: false,
    borderRadius: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    dash: dash ?? 0,
    dashEnabled: dashEnable ?? true,
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    closed: closed ?? false,
    colorText: "black",
    fontStyle: "Roboto",
    textDecoration: "none",
    zIndex: 0,
    fontWeight: 400,
    fontFamily: "Roboto",
    fontSize: 24,
    resolution: "landscape",
    src: image ?? "https://picsum.photos/200/300",
    text: "",
  };
};
