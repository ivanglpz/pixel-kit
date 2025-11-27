import {
  Align,
  Effect,
  Fill,
  FontWeight,
  IShape,
  Stroke,
  VerticalAlign,
} from "@/editor/shapes/type.shape";
import { atom } from "jotai";
import { Konva } from "konva/lib/_FullInternals";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { v4 as uuidv4 } from "uuid";
import {
  AlignItems,
  FlexDirection,
  FlexWrap,
  JustifyContent,
} from "../shapes/layout-flex";
import { ALL_SHAPES } from "../states/shapes";
import { UndoShape } from "../states/undo-redo";

const thickness = 1;

export const cloneDeep = (value: Object) => {
  if (!value) {
    return {};
  }
  if (typeof value !== "object") {
    return {};
  }
  return { ...JSON.parse(JSON.stringify(value)) };
};

// const initial: Omit<IShape, "children"> = {
//   id: uuidv4(),
//   x: 0,
//   y: 0,
//   tool: "FRAME",
//   align: "left",
//   offsetX: 0,
//   copyX: 0,
//   copyY: 0,
//   offsetCopyX: 0,
//   offsetCopyY: 0,
//   offsetY: 0,
//   verticalAlign: "top",
//   paddingBottom: 10,
//   paddingTop: 10,
//   borderBottomLeftRadius: 0,
//   isAllPadding: true,
//   borderBottomRightRadius: 0,
//   borderTopLeftRadius: 0,
//   borderTopRightRadius: 0,
//   paddingLeft: 10,
//   paddingRight: 10,
//   padding: 10,
//   maxHeight: 0,
//   maxWidth: 0,
//   minHeight: 0,
//   minWidth: 0,
//   effects: [],
//   isLocked: false,
//   fillContainerHeight: false,
//   fillContainerWidth: false,
//   label: "Box",
//   parentId: null,
//   rotation: 0,
//   opacity: 1,
//   fills: [
//     {
//       visible: true,
//       color: "#ffffff",
//       opacity: 1,
//       type: "fill",
//       id: uuidv4(),
//       image: {
//         height: 0,
//         name: "default.png",
//         src: "/placeholder.svg",
//         width: 0,
//       },
//     },
//   ],
//   isLayout: false,
//   alignItems: "flex-start",
//   flexDirection: "row",
//   flexWrap: "nowrap",
//   justifyContent: "flex-start",
//   gap: 10,
//   strokes: [],
//   visible: true,
//   height: 100,
//   width: 100,
//   points: [],
//   strokeWidth: thickness,
//   lineCap: "round",
//   lineJoin: "round",
//   shadowBlur: 0,
//   shadowOffsetY: thickness,
//   shadowOffsetX: thickness,
//   shadowOpacity: thickness,
//   isAllBorderRadius: true,
//   borderRadius: 0,
//   dash: 0,
//   fontStyle: "Roboto",
//   textDecoration: "none",
//   fontWeight: "normal",
//   fontFamily: "Roboto",
//   fontSize: 24,
//   text: "Hello World",
// };
export const CreateShapeSchema = (
  props?: Partial<IShape>
): Exclude<IShape, "children"> => {
  return {
    id: uuidv4(),
    x: atom(0),
    y: atom(0),
    tool: "FRAME",
    align: atom<Align>("left"),
    offsetX: 0,
    copyX: 0,
    copyY: 0,
    offsetCopyX: 0,
    offsetCopyY: 0,
    offsetY: 0,
    verticalAlign: atom<VerticalAlign>("top"),
    paddingBottom: atom(10),
    paddingTop: atom(10),
    borderBottomLeftRadius: atom(0),
    isAllPadding: atom(true),
    borderBottomRightRadius: atom(0),
    borderTopLeftRadius: atom(0),
    borderTopRightRadius: atom(0),
    paddingLeft: atom(10),
    paddingRight: atom(10),
    padding: atom(10),
    maxHeight: atom(0),
    maxWidth: atom(0),
    minHeight: atom(0),
    minWidth: atom(0),
    effects: atom<Effect[]>([]),
    isLocked: atom(false),
    fillContainerHeight: atom(false),
    fillContainerWidth: atom(false),
    label: atom("Default Text"),
    parentId: atom<string | null>(null),
    rotation: atom(0),
    opacity: atom(1),
    fills: atom<Fill[]>([]),
    isLayout: atom(false),
    alignItems: atom<AlignItems>("flex-start"),
    flexDirection: atom<FlexDirection>("row"),
    flexWrap: atom<FlexWrap>("nowrap"),
    justifyContent: atom<JustifyContent>("flex-start"),
    gap: atom(10),
    strokes: atom<Stroke[]>([]),
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

interface CommonPropsArgs {
  shape: IShape | UndoShape["state"];
  shadow?: Effect | undefined;
  stroke?: Stroke | undefined;
  fill?: Fill | undefined;
}

export const getCommonShapeProps = ({
  shape,
  shadow,
  stroke,
  fill,
}: CommonPropsArgs) => ({
  points: shape.points ?? [],
  fillEnabled: true,
  fill: fill?.color,
  stroke: stroke?.color,
  strokeWidth: shape.strokeWidth,
  strokeEnabled: shape.strokeWidth > 0,
  dash: [shape.dash],
  dashEnabled: shape.dash > 0,
  cornerRadius: !shape.isAllBorderRadius
    ? [
        shape.borderTopLeftRadius,
        shape.borderTopRightRadius,
        shape.borderBottomRightRadius,
        shape.borderBottomLeftRadius,
      ]
    : shape.borderRadius,
  shadowColor: shadow?.color,
  shadowOpacity: shape.shadowOpacity,
  shadowOffsetX: shape.shadowOffsetX,
  shadowOffsetY: shape.shadowOffsetY,
  shadowBlur: shape.shadowBlur,
  shadowEnabled: Boolean(shadow),
  opacity: shape.opacity ?? 1,
  width: shape.width,
  height: shape.height,
  text: shape.text ?? "",
  fontSize: shape.fontSize,
  fontFamily: shape.fontFamily,
  fontVariant: shape.fontWeight,
  align: shape.align as Konva.TextConfig["align"],
  lineHeight: 1.45,
});
