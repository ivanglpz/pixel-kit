/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/alt-text */
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { memo, MutableRefObject, useMemo, useRef } from "react";
import { Image as KonvaImage } from "react-konva";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { IShape, IShapeWithEvents, WithInitialValue } from "./type.shape";

function urlToBase64(
  url: string,
  callback: (b64: string | ArrayBuffer) => void
) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result ?? "");
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.error("Error al convertir URL a base64:", error);
    });
}

export const ShapeImage = memo(({ item }: IShapeWithEvents) => {
  // const {
  //   draggable,
  //   onClick,
  //   onDragMove,
  //   onDragStart,
  //   onDragStop,
  //   screenHeight,
  //   screenWidth,
  //   onDbClick,
  // } = item;
  const [image, setImage] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
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
    if (src?.includes("data:image")) {
      const image = new Image();
      image.src = src;
      return image;
    }

    const image = new Image();
    urlToBase64(src ?? "", (b64) => (image.src = b64 as string));
    return image;
  }, [src]);
  const stageDimensions = useAtomValue(STAGE_DIMENSION_ATOM);
  // const { isSelected } = item;
  const shapeRef = useRef<Konva.Image>();
  const trRef = useRef<Konva.Transformer>();

  // useEffect(() => {
  //   if (isSelected) {
  //     if (trRef.current && shapeRef.current) {
  //       trRef.current.nodes([shapeRef.current]);
  //       trRef.current?.getLayer()?.batchDraw();
  //     }
  //   }
  // }, [isSelected, item, trRef, shapeRef]);

  return (
    <>
      {/* <Valid isValid={isSelected}>
        <PortalConfigShape
          isSelected={isSelected}
          setShape={setImage}
          shape={image}
        />
      </Valid> */}
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
        // draggable={draggable}
        stroke={stroke}
        strokeWidth={strokeWidth}
        image={imageInstance}
        // onTap={(e) => setImage(shapeEventClick(e, onClick))}
        // onDblClick={() => onDbClick?.(image)}
        // onClick={(e) => setImage(shapeEventClick(e, onClick))}
        // onDragStart={(e) => setImage(ShapeEventDragStart(e, onDragStart))}
        // onDragMove={(e) =>
        //   setImage(shapeEventDragMove(e, onDragMove, screenWidth, screenHeight))
        // }
        // onTransform={(e) => {
        //   setImage(
        //     shapeEventDragMove(e, onDragMove, screenWidth, screenHeight)
        //   );
        // }}
        // onDragEnd={(e) => setImage(shapeEventDragStop(e, onDragStop))}
      />
      {/* <Transform isSelected={isSelected} ref={trRef} keepRatio /> */}
    </>
  );
});
