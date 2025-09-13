/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";
/* eslint-disable react/display-name */
import { useState } from "react";
import { constants } from "../constants/color";
import { SHAPE_IDS_ATOM } from "../states/shape";
import { TEXT_WRITING_IDS } from "../states/text";
import { PAUSE_MODE_ATOM } from "../states/tool";
import { apply } from "./apply";
import { sizeStyles } from "./size";

export const ShapeText = ({ shape: item, options }: IShapeWithEvents) => {
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
  const [textIds, setTextIds] = useAtom(TEXT_WRITING_IDS);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) return;
    e.stopPropagation();

    setDragging(true);
    setOffset({
      x: e.clientX - box.x,
      y: e.clientY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelected) return;
    e.stopPropagation();

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

        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...sizeStyles(box),
      }}
    >
      {textIds?.includes(box.id) ? (
        <textarea
          style={{
            opacity: box.opacity,
            fontSize: box.fontSize,
            wordBreak: "break-all",
            lineHeight: "normal",
            margin: 0,
            padding: 0,
            ...apply.color(box),
            ...apply.textShadow(box),
            fontWeight: box.fontWeight,
            fontFamily: box.fontFamily,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            resize: "none",
          }}
          value={box.text}
          onChange={(e) => {
            setBox({ ...box, text: e.target.value });
          }}
        >
          {box.text}
        </textarea>
      ) : (
        <p
          style={{
            opacity: box.opacity,
            fontSize: box.fontSize,
            wordBreak: "break-all",
            lineHeight: "normal",
            margin: 0,
            padding: 0,
            ...apply.color(box),
            ...apply.textShadow(box),
            fontWeight: box.fontWeight,
            fontFamily: box.fontFamily,
            width: "100%",
            height: "100%",
          }}
          onDoubleClick={() => {
            setTextIds([...textIds, box.id]);
            setPause(true);
          }}
        >
          {box.text}
        </p>
      )}
    </section>
  );
};
