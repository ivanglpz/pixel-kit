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
  const initial: IShape = {
    id: uuidv4(),
    x: 0,
    y: 0,
    tool: "BOX",
    align: "left",
    verticalAlign: "top",
    bordersRadius: [0, 0, 0, 0],
    effects: [],
    isLocked: false,
    isCreating: true,
    label: props?.tool ?? "DEFAULT",
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
          name: "",
          src: "",
          width: 0,
        },
      },
    ],
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
    isAllBorderRadius: false,
    borderRadius: 0,
    dash: 0,
    fontStyle: "Roboto",
    textDecoration: "none",
    zIndex: 0,
    fontWeight: "normal",
    fontFamily: "Roboto",
    fontSize: 24,
    text: "Hello World",
    ...props,
  };
  return cloneDeep(initial);
};
