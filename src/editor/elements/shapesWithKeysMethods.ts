import { IKeyTool } from "../hooks/tool/types";
import ShapeBox from "./box";
import AtomElementCircle from "./CIRCLE";
import AtomCodeElement from "./CODE/code";
import AtomElementDraw from "./DRAW";
import ShapeExport from "./export";
import AtomElementImage from "./IMAGE";
import AtomElementLine from "./LINE";
import AtomElementText from "./TEXT";
import { IShapeWithEvents } from "./type";

export type IMapperElements = {
  [key in IKeyTool]?: (props: IShapeWithEvents) => JSX.Element;
};

export const ShapesWithKeysMethods: IMapperElements = {
  BOX: ShapeBox,
  TEXT: AtomElementText,
  CIRCLE: AtomElementCircle,
  LINE: AtomElementLine,
  IMAGE: AtomElementImage,
  DRAW: AtomElementDraw,
  CODE: AtomCodeElement,
  EXPORT: ShapeExport,
};
