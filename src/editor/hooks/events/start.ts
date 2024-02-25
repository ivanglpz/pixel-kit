import { IElement } from "@/editor/elements/type";
import { v4 as uuidv4 } from "uuid";
import { IKeyMethods } from "../tool/types";

type ShapeStartProps = {
  x: number;
  y: number;
  count: number;
  pageId: string;
  tool: IKeyMethods;
  text?: string;
  image?: string;
  height?: number;
  width?: number;
};

export const shapeStart = (props: ShapeStartProps): IElement => {
  const { count, pageId, tool, x, y, image, height, text, width } = props;
  return {
    id: uuidv4(),
    x,
    y,
    pageId,
    isBlocked: false,
    tool: tool,
    visible: true,
    rotate: 0,
    height: height ?? 1,
    width: width ?? 1,
    view_position: count + 1,
    style: {
      stroke: "#ffffff",
      strokeWidth: 0,
      backgroundColor: "#ffffff",
      shadowBlur: 0,
      shadowColor: "#ffffff",
      shadowOffset: {
        x: 0,
        y: 0,
      },
      shadowOpacity: 1,
      isAllBorderRadius: false,
      borderRadius: 0,
      borderRadiusBottomLeft: 0,
      borderRadiusBottomRight: 0,
      borderRadiusTopLeft: 0,
      borderRadiusTopRight: 0,
      colorText: "black",
      fontStyle: "Roboto",
      textDecoration: "none",
      zIndex: 0,
      fontWeight: 400,
      fontFamily: "Roboto",
      fontSize: 12,
    },
    points: [x, y],
    resolution: "landscape",
    src: image ?? "https://picsum.photos/200/300",
    text: text ?? " Hello World",
  };
};
