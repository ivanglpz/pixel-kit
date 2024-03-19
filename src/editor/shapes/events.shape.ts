import { KonvaEventObject } from "konva/lib/Node";
import { IShape } from "./type.shape";

type Drag = (shape: IShape) => void;
type Click = Drag;

export const ShapeEventDragStart =
  (evt: KonvaEventObject<DragEvent>, onDragStart: Drag) => (prev: IShape) => {
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
    };
    onDragStart(payload);
    return payload;
  };
export const shapeEventDragMove =
  (evt: KonvaEventObject<DragEvent>, onDragMove: Drag) => (prev: IShape) => {
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
    };
    onDragMove(payload);

    return payload;
  };
export const shapeEventDragStop =
  (evt: KonvaEventObject<DragEvent>, onDragStop: Drag) => (prev: IShape) => {
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
    };
    onDragStop(payload);
    return payload;
  };
export const shapeEventClick =
  (evt: KonvaEventObject<MouseEvent>, onClick: Click) => (prev: IShape) => {
    onClick(prev);
    return prev;
  };
