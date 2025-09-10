import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { constants } from "../constants/color";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { apply } from "./apply";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";

// eslint-disable-next-line react/display-name
const ShapeBox = ({ shape: item, options }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    // e.stopPropagation();
    setDragging(true);
    setOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelected) return;

    // e.stopPropagation();
    if (!dragging) return;
    setBox({
      ...box,
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    if (!isSelected) return;

    setDragging(false);
  };
  const childrens = useAtomValue(box.children);

  const children = childrens?.map((item) => {
    const Component = Shapes?.[item?.tool] as FCShapeWEvents;
    return (
      <Component
        shape={item}
        key={`pixel-group-shapes-${item?.id}-${item.tool}`}
        options={{
          isLayout: box.isLayout,
        }}
      />
    );
  });
  if (!box.visible) return null;

  return (
    <>
      <section
        id={box?.id}
        onClick={(e) => {
          e.stopPropagation();

          setShapeId({
            id: box?.id,
            parentId: box.parentId,
          });
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          outline: isSelected
            ? `2px solid ${constants.theme.colors.primary}`
            : "2px solid transparent",
          position: options?.isLayout ? "static" : "absolute",
          top: box.y,
          left: box.x,
          width: box.width,
          height: box.height,
          display: "flex",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            opacity: box.opacity,
            ...apply.backgroundColor(box),
            ...apply.borderRadius(box),
            ...apply.stroke(box),
            ...apply.strokeDash(box),
            ...apply.shadow(box),
            ...apply.flex(box),
            ...apply.padding(box),
          }}
        >
          {children}
        </div>
      </section>
    </>
  );
};

export default ShapeBox;
