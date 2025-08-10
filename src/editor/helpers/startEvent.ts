import { IShape } from "@/editor/shapes/type.shape";
import { v4 as uuidv4 } from "uuid";

const thickness = 5;

export const cloneDeep = (value: Object) => {
  if (!value) {
    return {};
  }
  if (typeof value !== "object") {
    return {};
  }
  return { ...JSON.parse(JSON.stringify(value)) };
};

export const shapeStart = (props: Partial<IShape>): IShape => {
  return cloneDeep({
    id: uuidv4(),
    x: 0,
    y: 0,
    tool: "BOX",
    isBlocked: false,
    isWritingNow: false,
    fillEnabled: true,
    align: "left",
    verticalAlign: "top",
    bordersRadius: [0, 0, 0, 0],
    effects: [],
    isLocked: false,
    label: props?.tool ?? "DEFAULT",
    parentId: null,
    rotation: 0,
    opacity: 1,
    fills: [
      {
        visible: true,
        color: "#ffffff",
        opacity: 1,
      },
    ],
    strokes: [],
    strokeEnabled: true,
    visible: true,
    rotate: 0,
    height: 100,
    width: 100,
    stroke: "#ffffff",
    points: [],
    strokeWidth: thickness,
    backgroundColor: "#ffffff",
    lineCap: "round",
    lineJoin: "round",
    shadowBlur: 0,
    shadowColor: "#000",
    shadowOffsetY: thickness,
    shadowOffsetX: thickness,
    shadowEnabled: false,
    shadowOpacity: thickness,
    isAllBorderRadius: false,
    borderRadius: 0,
    dash: 0,
    dashEnabled: false,
    closed: closed ?? false,
    colorText: "black",
    fontStyle: "Roboto",
    textDecoration: "none",
    zIndex: 0,
    fontWeight: "normal",
    fontFamily: "Roboto",
    fontSize: 24,
    resolution: "landscape",
    src: "",
    text: "",
    bezier: false,
    ...props,
  });
};
