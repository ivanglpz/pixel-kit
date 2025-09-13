import { IKeyTool } from "../states/tool";
import SHAPE_BOX from "./box.shape";
import { SHAPE_CIRCLE } from "./circle.shape";
import { SHAPE_IMAGE } from "./image.shape";
import { SHAPE_TEXT } from "./text.shape";
import { ShapeProps } from "./type.shape";

export type SHAPES_BY_KEY = {
  [key in IKeyTool]?: (item: ShapeProps) => JSX.Element | null;
};

export const SHAPES: SHAPES_BY_KEY = {
  BOX: SHAPE_BOX,
  TEXT: SHAPE_TEXT,
  CIRCLE: SHAPE_CIRCLE,
  IMAGE: SHAPE_IMAGE,
  GROUP: SHAPE_BOX,
};
