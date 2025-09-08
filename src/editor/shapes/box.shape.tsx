import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { apply } from "./apply";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = ({ shape: item }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const stage = useAtomValue(STAGE_DIMENSION_ATOM);
  const [shapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  if (!box.visible) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setBox({
      ...box,
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <>
      <div
        id={box?.id}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          position: "absolute",
          top: box.y,
          left: box.x,
          width: box.width,
          height: box.height,
          ...apply.backgroundColor(box),
          ...apply.borderRadius(box),
          ...apply.stroke(box),
          opacity: box.opacity,
          cursor: "move",
          // overflowY: "scroll",
          // overflowX: "hidden",
          // padding: 20,
          // display: "flex",
          // flexDirection: "column",
        }}
      />
    </>
  );
};

export default ShapeBox;
