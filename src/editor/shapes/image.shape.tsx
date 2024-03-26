/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
import Konva from "konva";
import {
  MutableRefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IShapeWithEvents } from "./type.shape";
import { Image as KonvaImage } from "react-konva";
import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
} from "./events.shape";
import { Transform } from "./transformer";
import { Valid } from "@/components/valid";

export const ShapeImage = memo((item: IShapeWithEvents) => {
  const {
    draggable,
    onClick,
    onDragMove,
    onDragStart,
    onDragStop,
    screenHeight,
    screenWidth,
  } = item;
  const [image, setImage] = useState(() => {
    return item.shape;
  });
  const {
    width,
    height,
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
    borderRadius,
    fillEnabled,
    shadowEnabled,
    strokeEnabled,
    dash,
    src,
    dashEnabled,
  } = image;

  const imageInstance = useMemo(() => {
    const dataImage = new Image();

    dataImage.src =
      src?.includes("https") || src?.includes("data:image")
        ? src
        : "https://picsum.photos/200/300";

    return dataImage;
  }, [src]);

  useEffect(() => {
    setImage(item.shape);
  }, [item.shape]);

  const { isSelected } = item;
  const shapeRef = useRef<Konva.Image>();
  const trRef = useRef<Konva.Transformer>();

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected, item, trRef, shapeRef]);

  return (
    <>
      <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setImage}
          shape={image}
        />
      </Valid>
      <KonvaImage
        id={image?.id}
        x={x}
        y={y}
        width={width}
        fillEnabled={fillEnabled ?? true}
        height={height}
        rotationDeg={rotate}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        shadowBlur={shadowBlur}
        strokeEnabled={strokeEnabled ?? true}
        shadowEnabled={shadowEnabled ?? true}
        dashEnabled={dashEnabled ?? true}
        dash={[dash, dash, dash, dash]}
        cornerRadius={borderRadius}
        fill={backgroundColor}
        ref={shapeRef as MutableRefObject<Konva.Image>}
        draggable={draggable}
        stroke={stroke}
        strokeWidth={strokeWidth}
        image={imageInstance}
        onClick={(e) => setImage(shapeEventClick(e, onClick))}
        onDragStart={(e) => setImage(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) =>
          setImage(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight))
        }
        onTransform={(e) => {
          setImage(
            shapeEventDragMove(e, onDragMove, screenWidth, screenHeight)
          );
        }}
        onDragEnd={(e) => setImage(shapeEventDragStop(e, onDragStop))}
      />
      <Transform isSelected={isSelected} ref={trRef} keepRatio />
    </>
  );
});
