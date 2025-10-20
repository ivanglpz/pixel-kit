import { IShapesKeys } from "../states/tool";
import { ShapeDraw } from "./drawn.shape";
import { SHAPE_FRAME } from "./frame.shape";
import { SHAPE_ICON } from "./icon.shape";
import { ShapeImage } from "./image.shape";
import { ShapeText } from "./text.shape";
import { IShapeEvents } from "./type.shape";

export type IMapperElements = {
  [key in IShapesKeys]: (item: IShapeEvents) => JSX.Element | null;
};

export const Shapes: IMapperElements = {
  // BOX: ShapeGroup,
  FRAME: SHAPE_FRAME,
  TEXT: ShapeText,
  // CIRCLE: ShapeCircle,
  // LINE: ShapeLine,
  IMAGE: ShapeImage,
  DRAW: ShapeDraw,
  ICON: SHAPE_ICON,
  // GROUP: ShapeGroup,
};
