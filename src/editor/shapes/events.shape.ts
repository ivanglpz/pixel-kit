import { KonvaEventObject } from "konva/lib/Node";
import { IShape } from "./type.shape";

type Drag = (shape: IShape) => void;

export const ShapeEventDragStart =
  (evt: KonvaEventObject<DragEvent>) => (prev: IShape) => {
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
    };
    return payload;
  };

const coordinatesShapeMove = (
  prev: IShape,
  stageWidth: number,
  stageHeight: number,
  evt: KonvaEventObject<DragEvent> | KonvaEventObject<Event>
): IShape => {
  const shape = evt.target;

  const stage = shape.getStage();
  if (!stage) return prev;

  const box = shape.getClientRect({ relativeTo: stage });
  const x = shape.x(); // relativo al grupo
  const y = shape.y();

  const newPos: IShape = { ...prev, x, y };

  if (box.x < 0) {
    newPos.x = x - box.x;
  }
  if (box.y < 0) {
    newPos.y = y - box.y;
  }
  if (box.x + (box.width ?? 0) > stageWidth) {
    newPos.x = x - (box.x + box.width - stageWidth);
  }
  if (box.y + (box.height ?? 0) > stageHeight) {
    newPos.y = y - (box.y + box.height - stageHeight);
  }

  shape.setPosition({ x: newPos.x, y: newPos.y });
  return newPos;
};

export const shapeEventDragMove =
  (
    evt: KonvaEventObject<DragEvent> | KonvaEventObject<Event>,
    stageWidth: number,
    stageHeight: number
  ) =>
  (prev: IShape) => {
    const payload = coordinatesShapeMove(prev, stageWidth, stageHeight, evt);

    return payload;
  };
export const shapeEventDragStop =
  (evt: KonvaEventObject<DragEvent>) => (prev: IShape) => {
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
    };
    return payload;
  };
export const shapeEventClick =
  (evt: KonvaEventObject<MouseEvent> | KonvaEventObject<Event>) =>
  (prev: IShape) => {
    return prev;
  };

export const shapeEventDoubleClick =
  (evt: KonvaEventObject<MouseEvent>) => (prev: IShape) => {
    return prev;
  };

export const shapeTransformEnd =
  (evt: KonvaEventObject<Event>) => (prev: IShape) => {
    const scaleX = evt.target.scaleX();
    const scaleY = evt.target.scaleY();
    evt.target.scaleX(1);
    evt.target.scaleY(1);
    const payload = {
      ...prev,
      x: evt.target.x(),
      y: evt.target.y(),
      rotate: prev.rotation,
      width: Math.max(5, evt.target.width() * scaleX),
      height: Math.max(evt.target.height() * scaleY),
    };

    return payload;
  };
