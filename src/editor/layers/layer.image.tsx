/* eslint-disable react-hooks/exhaustive-deps */
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";

import { IShape } from "../shapes/type.shape";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { IMAGE_RENDER_ATOM } from "../states/image";

export const LayerImage = () => {
  const image = useAtomValue(IMAGE_RENDER_ATOM);

  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  if (!image) return null;

  const dimension = calculateDimension(
    width,
    height,
    image?.width,
    image?.height
  );
  if (
    image?.base64 === "" ||
    image.base64 === undefined ||
    image.base64 === null
  )
    return null;

  return (
    <Layer id="layer-image-preview">
      <ShapeImage
        SHAPES={[]}
        item={{
          id: "1c46a759-c0f4-4978-8781-5f10ca8cfe8d",
          parentId: null,
          pageId: "f860ad7b-27ac-491a-ba77-1a81f004dac1",
          state: atom({
            ...dimension,
            id: "main-image-render-stage",
            tool: "IMAGE",
            visible: true,
            isLocked: true,
            dash: 0,
            fills: [
              {
                color: "#fff",
                id: "107183aa-dbb0-4986-9d17-066e30e88996",
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
    </Layer>
  );
};
