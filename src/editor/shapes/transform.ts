import { KonvaEventObject, Node, NodeConfig } from "konva/lib/Node";
import { Config } from "../states/mode";
import { coordinatesShapeMove } from "./events.shape";
import { IShape } from "./type.shape";

export const TransformDimension = (
  e: KonvaEventObject<Event, Node<NodeConfig>>,
  box: IShape,
  stage_dimension: Config["expand_stage_resolution"]
) => {
  const scaleX = e.target.scaleX();
  const scaleY = e.target.scaleY();
  e.target.scaleX(1);
  e.target.scaleY(1);
  const payload = coordinatesShapeMove(
    box,
    Number(stage_dimension?.width),
    Number(stage_dimension?.height),
    e
  );
  return {
    ...payload,
    rotation: e.target.rotation(),
    width: Math.max(5, e.target.width() * scaleX),
    height: Math.max(e.target.height() * scaleY),
  };
};
