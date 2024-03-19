import { MemoExoticComponent } from "react";
import { IKeyTool } from "../hooks/tool/types";
import ShapeBox from "./box.shape";
// import AtomElementCircle from "./circle.shape";
// import AtomCodeElement from "./code.shape";
// import AtomElementDraw from "./drawn.shape";
import ShapeExport from "./export.shape";
// import AtomElementImage from "./image.shape";
// import AtomElementLine from "./line.shape";
// import AtomElementText from "./text.shape";
import { IShapeWithEvents } from "./type.shape";
import { ShapeImage } from "./image.shape";

export type IMapperElements = {
  [key in IKeyTool]?: MemoExoticComponent<
    (item: IShapeWithEvents) => JSX.Element
  >;
};

export const Shapes: IMapperElements = {
  BOX: ShapeBox,
  // TEXT: AtomElementText,
  // CIRCLE: AtomElementCircle,
  // LINE: AtomElementLine,
  IMAGE: ShapeImage,
  // DRAW: AtomElementDraw,
  // CODE: AtomCodeElement,
  EXPORT: ShapeExport,
};
