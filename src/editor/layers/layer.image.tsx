/* eslint-disable react-hooks/exhaustive-deps */
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { useImageRender } from "../hooks/useImageRender";
import { ShapeImage } from "../shapes/image.shape";

import { IShape } from "../shapes/type.shape";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { SHAPES_NODES } from "../states/shapes";

export const LayerImage = () => {
  const { img } = useImageRender();
  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  const dimension = calculateDimension(width, height, img?.width, img?.height);

  if (!img?.base64) return null;

  return (
    <Layer id="layer-image-preview">
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
          } as IShape),
          tool: "IMAGE",
        }}
      />
    </Layer>
  );
};
