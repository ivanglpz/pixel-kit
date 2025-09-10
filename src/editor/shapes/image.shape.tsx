/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */

import { useState } from "react";

import { PrimitiveAtom, useAtom } from "jotai";
import { constants } from "../constants/color";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { apply } from "./apply";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

export const ShapeImage = ({ options, shape }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    shape.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const fill = box.fills
    ?.filter((e) => e?.visible && e?.type === "image")
    .at(0);

  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const isSelected = shapeId.some((w) => w.id === box.id);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    setDragging(true);
    setOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelected) return;

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

  if (!box.visible) return null;

  return (
    <div
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
      <img
        src={fill?.image?.src}
        alt={`image-${box.id}`}
        style={{
          width: box.width,
          height: box.height,
          opacity: box.opacity,
          ...apply.backgroundColor(box),
          ...apply.borderRadius(box),
          ...apply.stroke(box),
          ...apply.strokeDash(box),
          ...apply.shadow(box),
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
