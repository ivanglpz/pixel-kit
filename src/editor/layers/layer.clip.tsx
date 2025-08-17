/* eslint-disable react-hooks/exhaustive-deps */
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtom, useAtomValue } from "jotai";
import Konva from "konva";
import { Shape, ShapeConfig } from "konva/lib/Shape";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { Group, Layer, Line, Rect, Transformer } from "react-konva";
import { useReference } from "../hooks/useReference";
import { ShapeImage } from "../shapes/image.shape";
import { IShape } from "../shapes/type.shape";
import {
  CLIP_DIMENSION_ATOM,
  ICLIP_DIMENSION,
  SHOW_CLIP_ATOM,
} from "../states/clipImage";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { IMAGE_RENDER_ATOM } from "../states/image";

export const LayerClip = () => {
  // const { img } = useImageRender();
  const image = useAtomValue(IMAGE_RENDER_ATOM);
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);
  const showClip = useAtomValue(SHOW_CLIP_ATOM);
  const [box, setBox] = useAtom(CLIP_DIMENSION_ATOM);
  const dimension = useMemo(
    () => calculateDimension(width, height, image?.width, image?.height),
    [width, height, image?.width, image?.height]
  );
  const trRef = useRef<Konva.Transformer>(null);
  const shapeRef = useRef<Konva.Rect>(null);
  const gshRef = useRef<Konva.Group>(null);

  useReference({
    type: "CLIP",
    ref: gshRef,
  });

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

  const position = (payload: ICLIP_DIMENSION): ICLIP_DIMENSION => {
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
          SHAPES={[]}
          item={{
            id: "d5644580-df24-48ad-87fa-5cb4a51a5983",
            pageId: "main-image-render-stage",
            parentId: null,
            state: atom({
              ...dimension,
              id: "main-image-render-stage",
              tool: "IMAGE",
              visible: true,
              dash: 0,
              isLocked: true,
              fills: [
                {
                  color: "#fff",
                  id: "b45ef6ff-fd0b-4dcc-9be1-68a912723d14",
                  image: {
                    src: image?.base64,
                    height: image.height,
                    width: image.width,
                    name: "preview-edit-image",
                  },
                  opacity: 1,
                  type: "image",
                  visible: true,
                },
              ],
            } as IShape),
            tool: "IMAGE",
          }}
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
          setBox(payload);
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
          setBox(payload);
        }}
      />
      {showClip && (
        <>
          {/* Líneas verticales */}
          {[1, 2].map((i) => {
            const x = Number(box?.x ?? 0);
            const y = Number(box?.y ?? 0);
            const width = Number(box?.width ?? 0);
            const height = Number(box?.height ?? 0);

            return (
              <Line
                key={`v-${i}`}
                points={[
                  x + (width / 3) * i,
                  y,
                  x + (width / 3) * i,
                  y + height,
                ]}
                stroke="white"
                opacity={0.6}
                strokeWidth={1}
              />
            );
          })}

          {/* Líneas horizontales */}
          {[1, 2].map((i) => {
            const x = Number(box?.x ?? 0);
            const y = Number(box?.y ?? 0);
            const width = Number(box?.width ?? 0);
            const height = Number(box?.height ?? 0);

            return (
              <Line
                key={`h-${i}`}
                points={[
                  x,
                  y + (height / 3) * i,
                  x + width,
                  y + (height / 3) * i,
                ]}
                stroke="white"
                opacity={0.6}
                strokeWidth={1}
              />
            );
          })}
        </>
      )}
      <Transformer
        id="transformer-editable"
        ref={trRef}
        flipEnabled={false}
        keepRatio={false}
        rotateEnabled={false}
        anchorStrokeWidth={2}
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
        anchorSize={15}
        borderStroke="white"
        borderStrokeWidth={2}
        anchorCornerRadius={2}
        anchorStroke="gray"
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
