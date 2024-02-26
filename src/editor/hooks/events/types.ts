import { IShape, IPELMT, IParamsElement } from "../../elements/type";
import { IKeyMethods, IKeyTool } from "../tool/types";

export type IRelativePosition = {
  x: number;
  y: number;
};

export type IStartEvent = (
  event: IRelativePosition,
  count: number,
  pageId: string,
  groupId: string,
  params?: {
    text?: string;
    image?: string;
    width?: number;
    height?: number;
  }
) => IShape;

export type IEndEvent = (event: IRelativePosition, element: IShape) => IShape;

export type IEventElement = {
  [key in IKeyTool]?: {
    start: IStartEvent;
    progress: IEndEvent;
  };
};

export type IShapeProgressEvent = {
  [key in IKeyMethods]: (x: number, y: number, element: IShape) => IShape;
};

export type IStageEvents =
  | "STAGE_COPY_IMAGE_SHAPE"
  | "STAGE_IDLE"
  | "STAGE_TEMPORAL_CREATING_SHAPE"
  | "STAGE_TEMPORAL_UPDATING_SHAPE"
  | "STAGE_COPY_TEXT_SHAPE"
  | "STAGE_COPY_SHAPE_SVG"
  | "STAGE_DELETE_SHAPES"
  | "STAGE_COPY_SHAPE";
