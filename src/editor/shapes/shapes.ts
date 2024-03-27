import { MemoExoticComponent } from "react";
import { IKeyTool } from "../hooks/tool/types";
import ShapeBox from "./box.shape";
import { IShapeWithEvents } from "./type.shape";
import { ShapeImage } from "./image.shape";
import { ShapeCircle } from "./circle.shape";
import { ShapeDraw } from "./drawn.shape";
import { ShapeText } from "./text.shape";
import { ShapeLine } from "./line.shape";

export type IMapperElements = {
  [key in IKeyTool]?: MemoExoticComponent<
    (item: IShapeWithEvents) => JSX.Element
  >;
};

export const Shapes: IMapperElements = {
  BOX: ShapeBox,
  TEXT: ShapeText,
  CIRCLE: ShapeCircle,
  LINE: ShapeLine,
  IMAGE: ShapeImage,
  DRAW: ShapeDraw,
};
