/* eslint-disable react-hooks/exhaustive-deps */
import { Layer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";
import { useImageRender } from "../hooks/useImageRender";
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtomValue } from "jotai";

import { STAGE_DIMENSION_ATOM } from "../states/dimension";

export const LayerImage = () => {
  const { img } = useImageRender();
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  const dimension = calculateDimension(width, height, img?.width, img?.height);
  if (!img?.base64) return null;

  return (
    <Layer id="layer-image-preview">
      <ShapeImage
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
    </Layer>
  );
};
