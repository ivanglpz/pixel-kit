import {
  Effect,
  Fill,
  IShape,
  IShapeChildren,
  Stroke,
} from "@/editor/shapes/type.shape";
import { v4 as uuidv4 } from "uuid";
import { IKeyMethods } from "../states/tool";
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

const initial: Omit<IShape, "children"> = {
  id: uuidv4(),
  x: 0,
  y: 0,
  tool: "FRAME",
  align: "left",
  offsetX: 0,
  offsetY: 0,
  verticalAlign: "top",
  paddingBottom: 10,
  paddingTop: 10,
  borderBottomLeftRadius: 0,
  isAllPadding: true,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  paddingLeft: 10,
  paddingRight: 10,
  padding: 10,
  maxHeight: 0,
  maxWidth: 0,
  minHeight: 0,
  minWidth: 0,
  effects: [],
  isLocked: false,
  fillContainerHeight: false,
  fillContainerWidth: false,
  label: "Box",
  parentId: null,
  rotation: 0,
  opacity: 1,
  fills: [
    {
      visible: true,
      color: "#ffffff",
      opacity: 1,
      type: "fill",
      id: uuidv4(),
      image: {
        height: 0,
        name: "default.png",
        src: "/placeholder.svg",
        width: 0,
      },
    },
  ],
  isLayout: false,
  alignItems: "flex-start",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "flex-start",
  gap: 10,
  strokes: [],
  visible: true,
  height: 100,
  width: 100,
  points: [],
  strokeWidth: thickness,
  lineCap: "round",
  lineJoin: "round",
  shadowBlur: 0,
  shadowOffsetY: thickness,
  shadowOffsetX: thickness,
  shadowOpacity: thickness,
  isAllBorderRadius: true,
  borderRadius: 0,
  dash: 0,
  fontStyle: "Roboto",
  textDecoration: "none",
  fontWeight: "normal",
  fontFamily: "Roboto",
  fontSize: 24,
  text: "Hello World",
};
export const CreateShapeSchema = (
  props?: Partial<IShape> | IShapeChildren
): Exclude<IShape, "children"> => {
  return cloneDeep({ ...initial, ...props });
};

const isNotNegative = (value: number) => {
  return value < 1 ? 1 : value;
};
export type IShapeProgressEvent = {
  [key in IKeyMethods]: (x: number, y: number, element: IShape) => IShape;
};
export const UpdateShapeDimension = (
  x: number,
  y: number,
  element: IShape
): IShape => {
  const isHeight = isNotNegative(x - Number(element?.x));
  const isWidth = isNotNegative(y - Number(element?.y));
  return cloneDeep({
    ...element,
    width: isHeight,
    height: isWidth,
  });
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
});
