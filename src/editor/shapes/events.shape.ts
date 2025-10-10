import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { IShape } from "./type.shape";

export const coordinatesShapeMove = (
  prev: IShape,
  evt: KonvaEventObject<DragEvent> | KonvaEventObject<Event>
): IShape => {
  const shape = evt.target;

  const stage = shape.getStage();
  if (!stage) return prev;

  const box = shape.getClientRect({ relativeTo: stage });
  const x = shape.x(); // relativo al grupo
  const y = shape.y();

  const newPos: IShape = { ...prev, x, y };

  // if (box.x < 0) {
  //   newPos.x = x - box.x;
  // }
  // if (box.y < 0) {
  //   newPos.y = y - box.y;
  // }
  // if (box.x + (box.width ?? 0) > stageWidth) {
  //   newPos.x = x - (box.x + box.width - stageWidth);
  // }
  // if (box.y + (box.height ?? 0) > stageHeight) {
  //   newPos.y = y - (box.y + box.height - stageHeight);
  // }

  // shape.setPosition({ x: newPos.x, y: newPos.y });
  return newPos;
};

export const TransformDimension = (
  e: KonvaEventObject<Event, Node<NodeConfig>>,
  box: IShape
) => {
  const scaleX = e.target.scaleX();
  const scaleY = e.target.scaleY();
  e.target.scaleX(1);
  e.target.scaleY(1);
  const payload = coordinatesShapeMove(box, e);
  return {
    ...payload,
    rotation: e.target.rotation(),
    width: Math.max(5, e.target.width() * scaleX),
    height: Math.max(e.target.height() * scaleY),
  };
};
