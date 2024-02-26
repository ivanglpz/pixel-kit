import Konva from "konva";
import { MutableRefObject, memo, useEffect, useRef, useState } from "react";
import { Rect, Transformer } from "react-konva";
import { IShape, IShapeWithEvents } from "../type";
import { KonvaEventObject } from "konva/lib/Node";
import { Html } from "react-konva-utils";
import { createPortal } from "react-dom";
import ShapeConfig from "@/editor/layout/sidebar/right/shape/config";
// eslint-disable-next-line react/display-name
const ShapeBox = memo((item: IShapeWithEvents) => {
  const {
    draggable,
    isSelected,
    onClick,
    onDragMove,
    onDragStart,
    onDragStop,
  } = item;

  const [box, setBox] = useState(() => {
    return item.shape;
  });

  const {
    width,
    height,
    resolution,
    shadowColor,
    shadowOpacity,
    rotate,
    x,
    y,
    shadowOffsetY,
    shadowOffsetX,
    shadowBlur,
    stroke,
    strokeWidth,
    backgroundColor,
  } = box;

  const shapeRef = useRef<Konva.Rect>();
  const trRef = useRef<Konva.Transformer>();

  const shapeClick = (evt: KonvaEventObject<MouseEvent>) => {
    setBox((prev) => {
      onClick(prev);
      return prev;
    });
  };
  const shapeDragStart = (evt: KonvaEventObject<DragEvent>) => {
    setBox((prev) => {
      const payload = {
        ...prev,
        x: evt.target.x(),
        y: evt.target.y(),
      };
      onDragStart(payload);
      return payload;
    });
  };
  const shapeDragMove = (evt: KonvaEventObject<DragEvent>) => {
    setBox((prev) => {
      const payload = {
        ...prev,
        x: evt.target.x(),
        y: evt.target.y(),
      };
      onDragMove(payload);

      return payload;
    });
  };
  const shapeDragStop = (evt: KonvaEventObject<DragEvent>) => {
    setBox((prev) => {
      const payload = {
        ...prev,
        x: evt.target.x(),
        y: evt.target.y(),
      };
      onDragStop(payload);
      return payload;
    });
  };

  const shapeTransformEnd = (evt: KonvaEventObject<Event>) => {
    setBox((prev) => {
      if (shapeRef?.current) {
        const node = shapeRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        const payload = {
          ...prev,
          x: node.x(),
          y: node.y(),
          rotate,
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        };
        onDragStop(payload);

        return payload;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, trRef, shapeRef]);

  useEffect(() => {
    setBox(item.shape);
  }, [item.shape]);

  const sidebarElement = document.getElementById("pixel-kit-sidebar-right");

  const handleChangeWithKey = (
    keyProp: keyof IShape,
    value: string | number
  ) => {
    setBox((prev) => {
      return {
        ...prev,
        [keyProp]: value,
      };
    });
  };

  return (
    <>
      <Html
        divProps={{
          style: {
            position: "absolute",
            top: 10,
            left: 10,
          },
        }}
      >
        {sidebarElement && sidebarElement instanceof Element && isSelected
          ? createPortal(
              <ShapeConfig
                id={box.id}
                tool={box.tool}
                shadowColor={box.shadowColor}
                strokeColor={box.stroke}
                fillColor={`${box.backgroundColor}`}
                onChangeFillColor={(fillColor) => {
                  handleChangeWithKey("backgroundColor", fillColor);
                }}
                onChangeShadowColor={(shadowColor) => {
                  handleChangeWithKey("shadowColor", shadowColor);
                }}
                onChangeStrokeColor={(strokeColor) => {
                  handleChangeWithKey("stroke", strokeColor);
                }}
              />,
              sidebarElement
            )
          : null}
      </Html>
      <Rect
        id={box?.id}
        x={x}
        y={y}
        width={width}
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        cornerRadius={200}
        fill={backgroundColor}
        ref={shapeRef as MutableRefObject<Konva.Rect>}
        draggable={draggable}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onClick={shapeClick}
        onDragStart={shapeDragStart}
        onDragMove={shapeDragMove}
        onDragEnd={shapeDragStop}
        onTransformEnd={shapeTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef as MutableRefObject<Konva.Transformer>}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
});

export const isPartialBorderRadius = (item: IShapeWithEvents) => {
  return {
    cornerRadius: [],
  };
};

export default ShapeBox;
