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

const coordinatesShapeMove = (
  prev: IShape,
  stageWidth: number,
  stageHeight: number,
  evt: KonvaEventObject<DragEvent> | KonvaEventObject<Event>
) => {
  const box = evt.target.getClientRect();
  const absPos = evt.target.getAbsolutePosition();
  const offsetX = box.x - absPos.x;
  const offsetY = box.y - absPos.y;

  const newAbsPos = { ...prev, ...absPos };

  if (box.x < 0) {
    newAbsPos.x = -offsetX;
  }
  if (box.y < 0) {
    newAbsPos.y = -offsetY;
  }
  if (box.x + (box?.width ?? 0) > stageWidth) {
    newAbsPos.x = stageWidth - box.width - offsetX;
  }
  if (box.y + (box.height ?? 0) > stageHeight) {
    newAbsPos.y = stageHeight - box.height - offsetY;
  }
  evt.target.setAbsolutePosition(newAbsPos);
  return newAbsPos;
};

export const shapeEventDragMove =
  (
    evt: KonvaEventObject<DragEvent> | KonvaEventObject<Event>,
    onDragMove: Drag,
    stageWidth: number,
    stageHeight: number
  ) =>
  (prev: IShape) => {
    const payload = coordinatesShapeMove(prev, stageWidth, stageHeight, evt);
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

export const shapeEventDoubleClick =
  (evt: KonvaEventObject<MouseEvent>, onClick: Click) => (prev: IShape) => {
    onClick(prev);
    return prev;
  };

export const shapeTransformEnd =
  (evt: KonvaEventObject<Event>, onDragStop: Drag) => (prev: IShape) => {
    const scaleX = evt.target.scaleX();
    const scaleY = evt.target.scaleY();
    evt.target.scaleX(1);
    evt.target.scaleY(1);
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
      rotate: prev.rotate,
      width: Math.max(5, evt.target.width() * scaleX),
      height: Math.max(evt.target.height() * scaleY),
    };
    onDragStop(payload);

    return payload;
  };
