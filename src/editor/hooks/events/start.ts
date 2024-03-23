import { v4 as uuidv4 } from "uuid";
import { IKeyMethods } from "../tool/types";
import { IShape } from "@/editor/shapes/type.shape";

type ShapeStartProps = {
  x: number;
  y: number;
  tool: IKeyMethods;
  text?: string;
  image?: string;
  height?: number;
  width?: number;
};

export const shapeStart = (props: ShapeStartProps): IShape => {
  const { tool, x, y, image, height, text, width } = props;
  return {
    id: uuidv4(),
    x,
    y,
    isBlocked: false,
    tool: tool,
    visible: true,
    rotate: 0,
    height: height ?? 1,
    width: width ?? 1,
    stroke: "#ffffff",
    strokeWidth: 0,
    backgroundColor: "#ffffff",
    shadowBlur: 0,
    shadowColor: "#ffffff",
    shadowOffsetY: 0,
    shadowOffsetX: 0,
    shadowOpacity: 1,
    isAllBorderRadius: false,
    borderRadius: 0,
    borderRadiusBottomLeft: 0,
    borderRadiusBottomRight: 0,
    dash: 50,
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    colorText: "black",
    fontStyle: "Roboto",
    textDecoration: "none",
    zIndex: 0,
    fontWeight: 400,
    fontFamily: "Roboto",
    fontSize: 12,
    points: [x, y],
    resolution: "landscape",
    src: image ?? "https://picsum.photos/200/300",
    text: text ?? " Hello World",
  };
};
