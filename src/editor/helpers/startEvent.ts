import { v4 as uuidv4 } from "uuid";
import { IShape } from "@/editor/shapes/type.shape";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { image_stock } from "@/assets/image_stock";
import { IKeyMethods } from "@/editor/states/tool";

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
  bezier?: boolean;
};

const thickness = 5;

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
    bezier,
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
    height: height ?? 100,
    width: width ?? 100,
    stroke: stroke ?? "#ffffff",
    points: points ?? [],
    strokeWidth: strokeWidth ?? thickness,
    backgroundColor: "#ffffff",
    lineCap: lineCap ?? "round",
    lineJoin: lineJoin ?? "round",
    shadowBlur: shadowBlur ?? 0,
    shadowColor: shadowColor ?? "#000",
    shadowOffsetY: shadowOffsetY ?? thickness,
    shadowOffsetX: shadowOffsetX ?? thickness,
    shadowEnabled: tool === "IMAGE" ? false : (shadowEnabled ?? true),
    shadowOpacity: shadowOpacity ?? thickness,
    isAllBorderRadius: false,
    borderRadius: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    dash: dash ?? thickness,
    dashEnabled: dashEnable ?? true,
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    closed: closed ?? false,
    colorText: "black",
    fontStyle: "Roboto",
    textDecoration: "none",
    zIndex: 0,
    fontWeight: "normal",
    fontFamily: "Roboto",
    fontSize: 24,
    resolution: "landscape",
    src: image ?? image_stock,
    text: "",
    bezier: bezier ?? false,
  };
};
