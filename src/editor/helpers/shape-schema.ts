import { IShape } from "@/editor/shapes/type.shape";
import { v4 as uuidv4 } from "uuid";
import { IKeyMethods } from "../states/tool";

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
  tool: "BOX",
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
  props: Partial<IShape>
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
    borderRadius:
      element?.tool === "CIRCLE"
        ? isNotNegative(Number(element?.width) / 2)
        : 0,
  });
};
