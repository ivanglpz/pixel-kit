import { IKeyTool } from "../states/tool";
import { ShapeCircle } from "./circle.shape";
import { ShapeDraw } from "./drawn.shape";
import { ShapeGroup } from "./group.shape";
import { ShapeImage } from "./image.shape";
import { ShapeLine } from "./line.shape";
import { ShapeText } from "./text.shape";
import { IShapeWithEvents } from "./type.shape";

export type IMapperElements = {
  [key in IKeyTool]?: (item: IShapeWithEvents) => JSX.Element | null;
};

export const Shapes: IMapperElements = {
  BOX: ShapeGroup,
  TEXT: ShapeText,
  CIRCLE: ShapeCircle,
  LINE: ShapeLine,
  IMAGE: ShapeImage,
  DRAW: ShapeDraw,
  GROUP: ShapeGroup,
};
