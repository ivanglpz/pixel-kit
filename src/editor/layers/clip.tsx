/* eslint-disable react-hooks/exhaustive-deps */
import { Group, Layer, Rect, Transformer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";
import { useImageRender } from "../hooks/useImageRender";
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtom, useAtomValue } from "jotai";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { IShape } from "../shapes/type.shape";
import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { boxClipAtom, showClipAtom } from "../states/clipImage";
import { useReference } from "../hooks/useReference";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPES_NODES } from "../states/shapes";

export const LayerClip = () => {
  const { img } = useImageRender();
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const showClip = useAtomValue(showClipAtom);

  const dimension = useMemo(
    () => calculateDimension(width, height, img?.width, img?.height),
    [width, height, img?.width, img?.height]
  );
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  const gshRef = useRef<Konva.Group>(null);

  useReference({
    type: "CLIP",
    ref: gshRef,
  });

  const [box, setBox] = useAtom(boxClipAtom);

  useEffect(() => {
    setBox({
      x: dimension.x,
      y: dimension.y,
      width: dimension.width,
      height: dimension.height,
    });
  }, [dimension.x, dimension.x, dimension.width, dimension.height]);

  useEffect(() => {
    if (showClip && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer?.()?.batchDraw();
    }
  }, [showClip, trRef.current, shapeRef.current]);

  const position = (payload: Partial<IShape>) => {
    if (Number(payload?.x) < Number(dimension?.x)) {
      payload.x = dimension.x;
    }
    if (Number(payload.y) < Number(dimension?.y)) {
      payload.y = dimension.y;
    }

    if (
      Number(payload?.x) + Number(payload.width) >
      dimension.x + dimension?.width
    ) {
      const p1 = Number(payload?.x) + Number(payload.width);
      const p2 = dimension.x + dimension?.width;
      const rp = p1 - p2;
      payload.x = Number(payload?.x) - rp;
    }
    if (
      Number(payload.y) + Number(payload?.height) >
      dimension.y + dimension.height
    ) {
      const h1 = Number(payload.y) + Number(payload?.height);
      const h2 = dimension.y + dimension.height;
      const rh = h1 - h2;
      payload.y = Number(payload.y) - rh;
    }
    return payload;
  };
  if (!showClip) return null;

  return (
    <Layer id="layer-clip-image-preview">
      <Rect
        x={dimension?.x}
        y={dimension?.y}
        width={dimension?.width}
        height={dimension?.height}
        fill="rgba(0,0,0,0.6)"
      />
      <Group
        ref={gshRef}
        clipWidth={box.width}
        clipHeight={box.height}
        clipX={box.x}
        clipY={box.y}
      >
        <ShapeImage
          item={{
            id: "1c024656-106b-4d70-bc5c-845637d3344a",
            childrens: atom<SHAPES_NODES[]>([]),
            state: atom<IShape>({
              ...dimension,
              id: "main-image-render-stage",
              src: img?.base64,
              isBlocked: true,
              tool: "IMAGE",
              visible: true,
              fillEnabled: true,
              dash: 0,
              isWritingNow: false,
              strokeEnabled: false,
              shadowEnabled: false,
              dashEnabled: false,
              bezier: false,
              x: 0,
              y: 0,
            }),
            tool: "IMAGE",
          }}
          screenHeight={height}
          screenWidth={width}
          isSelected={false}
          draggable={false}
          onClick={() => {}}
          onDragMove={() => {}}
          onDragStart={() => {}}
          onDragStop={() => {}}
          onTransformStop={() => {}}
          shape={atom({
            ...dimension,
            id: "main-image-render-stage",
            src: img?.base64,
            isBlocked: true,
            tool: "IMAGE",
            visible: true,
            fillEnabled: true,
            dash: 0,
            isWritingNow: false,
            strokeEnabled: false,
            shadowEnabled: false,
            dashEnabled: false,
            bezier: false,
          })}
        />
      </Group>
      <Rect
        ref={shapeRef as MutableRefObject<Konva.Rect>}
        x={box?.x}
        y={box?.y}
        width={box?.width}
        height={box?.height}
        draggable
        onDragMove={(e) => {
          let payload = position({
            x: e.target.x(),
            y: e.target.y(),
            width: box.width,
            height: box.height,
          });
          e.target.setAbsolutePosition({
            x: Number(payload.x),
            y: Number(payload.y),
          });
          setBox(payload);
        }}
        onDragEnd={(e) => {}}
        onTransform={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          e.target.scaleX(1);
          e.target.scaleY(1);
          let newWidth = Math.max(5, e.target.width() * scaleX);

          if (newWidth > dimension.width) {
            newWidth = dimension.width;
          }

          let newHeight = Math.max(e.target.height() * scaleY);

          if (newHeight > dimension.height) {
            newHeight = dimension.height;
          }
          let payload = position({
            x: e.target.x(),
            y: e.target.y(),
            width: newWidth,
            height: newHeight,
          });
          e.target.setAbsolutePosition({
            x: Number(payload.x),
            y: Number(payload.y),
          });
          setBox((prev) => ({
            ...prev,
            rotate: prev.rotate,
            ...payload,
          }));
        }}
        onTransformEnd={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          e.target.scaleX(1);
          e.target.scaleY(1);
          let newWidth = Math.max(5, e.target.width() * scaleX);

          if (newWidth > dimension.width) {
            newWidth = dimension.width;
          }

          let newHeight = Math.max(e.target.height() * scaleY);

          if (newHeight > dimension.height) {
            newHeight = dimension.height;
          }
          let payload = position({
            x: e.target.x(),
            y: e.target.y(),
            width: newWidth,
            height: newHeight,
          });
          e.target.setAbsolutePosition({
            x: Number(payload.x),
            y: Number(payload.y),
          });
          setBox((prev) => ({
            ...prev,
            rotate: prev.rotate,
            ...payload,
          }));
        }}
      />
      <Transformer
        id="transformer-editable"
        ref={trRef}
        flipEnabled={false}
        keepRatio={false}
        anchorStrokeWidth={3}
        anchorStyleFunc={(configAnchor) => {
          const anchor = configAnchor as Shape<ShapeConfig> & {
            cornerRadius: (v: number) => void;
          };
          if (anchor.hasName("top-center") || anchor.hasName("bottom-center")) {
            anchor.cornerRadius(20);
            anchor.height(10);
            anchor.offsetY(5);
            anchor.width(30);
            anchor.offsetX(15);
          }
          if (anchor.hasName("middle-left") || anchor.hasName("middle-right")) {
            anchor.cornerRadius(20);
            anchor.height(30);
            anchor.offsetY(15);
            anchor.width(10);
            anchor.offsetX(5);
          }
        }}
        anchorSize={20}
        borderStrokeWidth={4}
        anchorCornerRadius={4}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </Layer>
  );
};
