import { Align, FontWeight, VerticalAlign } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import Konva from "konva";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { v4 as uuidv4 } from "uuid";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { ShapeImage } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { ALL_SHAPES } from "../states/shapes";
import { CTX_EXP } from "../utils/export";

export const cloneDeep = (value: Object) => {
  if (!value) {
    return {};
  }
  if (typeof value !== "object") {
    return {};
  }
  return { ...JSON.parse(JSON.stringify(value)) };
};

export const CreateShapeSchema = (props?: Partial<ShapeState>): ShapeState => {
  return {
    id: uuidv4(),
    x: atom(0),
    y: atom(0),
    tool: "FRAME",
    align: atom<Align>("left"),
    fillColor: atom("#ffffff"),
    strokeColor: atom("#ffffff"),
    offsetX: atom(0),
    copyX: atom(0),
    copyY: atom(0),
    offsetCopyX: atom(0),
    offsetCopyY: atom(0),
    offsetY: atom(0),
    image: atom({
      width: 1200,
      height: 1200,
      name: "default.png",
      src: "/placeholder.svg",
    } as ShapeImage),
    verticalAlign: atom<VerticalAlign>("top"),
    paddingBottom: atom(10),
    paddingTop: atom(10),
    borderBottomLeftRadius: atom(0),
    isAllPadding: atom(true),
    borderBottomRightRadius: atom(0),
    borderTopLeftRadius: atom(0),
    borderTopRightRadius: atom(0),
    paddingLeft: atom(0),
    paddingRight: atom(0),
    padding: atom(0),
    maxHeight: atom(0),
    maxWidth: atom(0),
    minHeight: atom(0),
    minWidth: atom(0),
    shadowColor: atom("#ffffff"),
    isLocked: atom(false),
    fillContainerHeight: atom(false),
    fillContainerWidth: atom(false),
    label: atom("Default Text"),
    parentId: atom<string | null>(null),
    rotation: atom(0),
    opacity: atom(1),
    isLayout: atom(false),
    alignItems: atom<AlignItems>("flex-start"),
    flexDirection: atom<FlexDirection>("row"),
    flexWrap: atom<FlexWrap>("nowrap"),
    justifyContent: atom<JustifyContent>("flex-start"),
    gap: atom(0),
    visible: atom(true),
    height: atom(100),
    width: atom(100),
    points: atom<number[]>([]),
    strokeWidth: atom(0),
    lineCap: atom<LineCap>("round"),
    lineJoin: atom<LineJoin>("round"),
    shadowBlur: atom(0),
    shadowOffsetY: atom(0),
    shadowOffsetX: atom(0),
    shadowOpacity: atom(0),
    isAllBorderRadius: atom(true),
    borderRadius: atom(0),
    dash: atom(0),
    fontStyle: atom("Roboto"),
    textDecoration: atom("none"),
    fontWeight: atom<FontWeight>("normal"),
    fontFamily: atom("Roboto"),
    fontSize: atom(24),
    text: atom("Hello World"),
    children: atom<ALL_SHAPES[]>([]),
    ...props,
  };
};

export const isNotNegative = (value: number) => {
  return value < 1 ? 1 : value;
};
export const getCommonShapeProps = (shape: ShapeState, ctx: CTX_EXP) => {
  return {
    points: ctx.get(shape.points) ?? [],
    fillEnabled: true,
    fill: ctx.get(shape?.fillColor),
    stroke: ctx.get(shape.strokeColor),
    strokeWidth: ctx.get(shape.strokeWidth),
    strokeEnabled:
      shape.tool !== "TEXT" ? ctx.get(shape.strokeWidth) > 0 : false,
    dash: [ctx.get(shape.dash)],
    dashEnabled: ctx.get(shape.dash) > 0,
    cornerRadius: !ctx.get(shape.isAllBorderRadius)
      ? [
          ctx.get(shape.borderTopLeftRadius),
          ctx.get(shape.borderTopRightRadius),
          ctx.get(shape.borderBottomRightRadius),
          ctx.get(shape.borderBottomLeftRadius),
        ]
      : ctx.get(shape.borderRadius),
    shadowColor: ctx.get(shape.shadowColor),
    shadowOpacity: ctx.get(shape.shadowOpacity),
    shadowOffsetX: ctx.get(shape.shadowOffsetX),
    shadowOffsetY: ctx.get(shape.shadowOffsetY),
    shadowBlur: ctx.get(shape.shadowBlur),
    shadowEnabled: true,
    opacity: ctx.get(shape.opacity) ?? 1,
    width: ctx.get(shape.width),
    height: ctx.get(shape.height),
    text: ctx.get(shape.text) ?? "",
    fontSize: ctx.get(shape.fontSize),
    fontFamily: ctx.get(shape.fontFamily),
    fontVariant: ctx.get(shape.fontWeight),
    align: ctx.get(shape.align) as Konva.TextConfig["align"],
    lineHeight: 1.45,
  };
};
