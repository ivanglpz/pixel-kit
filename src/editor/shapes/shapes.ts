import { IKeyTool } from "../states/tool";
import ShapeBox from "./box.shape";
import { ShapeCircle } from "./circle.shape";
import { ShapeDraw } from "./drawn.shape";
import { ShapeImage } from "./image.shape";
import { ShapeLine } from "./line.shape";
import { ShapeText } from "./text.shape";
import { IShapeWithEvents } from "./type.shape";

export type IMapperElements = {
  [key in IKeyTool]?: (item: IShapeWithEvents) => JSX.Element | null;
};

export const Shapes: IMapperElements = {
  BOX: ShapeBox,
  TEXT: ShapeText,
  CIRCLE: ShapeCircle,
  LINE: ShapeLine,
  IMAGE: ShapeImage,
  DRAW: ShapeDraw,
  GROUP: ShapeBox,
};
