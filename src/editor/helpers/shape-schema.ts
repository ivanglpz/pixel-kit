import { Align, FontWeight, VerticalAlign } from "@/editor/shapes/type.shape";
import { atom } from "jotai";
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
import { IShapeTool } from "../states/tool";

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
    tool: atom<IShapeTool>("FRAME"),
    sourceShapeId: atom<string | null>(null),
    isComponent: atom<boolean>(false),
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
    paddingBottom: atom(0),
    paddingTop: atom(0),
    borderBottomLeftRadius: atom(0),
    isAllPadding: atom(false),
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
    isAllBorderRadius: atom(false),
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
