import { IElement } from "@/editor/core/elements/type";
import { v4 as uuidv4 } from "uuid";
import { IRelativePosition } from "../../types";

const lineElementStart = (
  event: IRelativePosition,
  count: number,
  pageId: string,
  groupId: string
): IElement => {
  const { x, y } = event;
  return {
    id: uuidv4(),
    x,
    y,
    pageId,
    isBlocked: false,
    groupId,
    tool: "LINE",
    visible: true,
    text: "",
    style: {
      stroke: "#000",
      strokeWidth: 4,
    },
    view_position: count + 1,
    rotate: 0,
    height: 100,
    width: 400,
  };
};
export default lineElementStart;
