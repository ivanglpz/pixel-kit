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
import { Image as KonvaImage, Transformer } from "react-konva";
import { PortalConfigShape } from "./config.shape";
import {
  shapeEventClick,
  shapeEventDragMove,
  ShapeEventDragStart,
  shapeEventDragStop,
} from "./events.shape";

export const ShapeImage = memo((item: IShapeWithEvents) => {
  const { draggable, onClick, onDragMove, onDragStart, onDragStop } = item;
  const [image, setImage] = useState(() => {
    return item.shape;
  });
  const {
    x,
    y,
    id,
    width,
    height,
    backgroundColor,
    shadowBlur,
    stroke,
    shadowColor,
    shadowOpacity,
    shadowOffsetY,
    shadowOffsetX,
    strokeWidth,
    src,
    borderRadius,
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
      <PortalConfigShape
        isSelected={isSelected}
        setShape={setImage}
        shape={image}
      />
      <KonvaImage
        x={x}
        id={id}
        y={y}
        width={width}
        height={height}
        cornerRadius={borderRadius}
        image={imageInstance}
        fill={backgroundColor}
        shadowBlur={shadowBlur}
        stroke={stroke}
        shadowColor={shadowColor}
        shadowOpacity={shadowOpacity}
        shadowOffsetX={shadowOffsetX}
        shadowOffsetY={shadowOffsetY}
        strokeWidth={strokeWidth}
        rotation={0}
        ref={shapeRef as MutableRefObject<Konva.Image>}
        draggable={draggable}
        onClick={(e) => setImage(shapeEventClick(e, onClick))}
        onDragStart={(e) => setImage(ShapeEventDragStart(e, onDragStart))}
        onDragMove={(e) => setImage(shapeEventDragMove(e, onDragMove))}
        onDragEnd={(e) => setImage(shapeEventDragStop(e, onDragStop))}
      />
      {isSelected && (
        <Transformer
          ref={trRef as MutableRefObject<Konva.Transformer>}
          keepRatio={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
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
