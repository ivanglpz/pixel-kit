/* eslint-disable react-hooks/exhaustive-deps */
import { calculateDimension } from "@/editor/utils/calculateDimension";
import { atom, useAtomValue } from "jotai";
import { Layer } from "react-konva";
import { ShapeImage } from "../shapes/image.shape";

import { IShape } from "../shapes/type.shape";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { IMAGE_RENDER_ATOM } from "../states/image";
import { ALL_SHAPES } from "../states/shapes";

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

  const shape: IShape = {
    ...dimension,
    align: "center",
    tool: "IMAGE",
    visible: true,
    isLocked: true,
    dash: 0,
    rotation: 0,
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
    id: "main-image-render-stage",
    verticalAlign: "top",
    bordersRadius: [0, 0, 0, 0],
    effects: [],
    label: "DRAW",
    parentId: null,
    fillContainerHeight: false,
    fillContainerWidth: false,
    opacity: 1,
    layouts: [],
    strokes: [
      {
        id: "559c1735-4e62-4c43-aa4c-246ec594ca06",
        visible: true,
        color: "#fff",
      },
    ],
    points: [],
    strokeWidth: 1,
    backgroundColor: "#ffffff",
    lineCap: "round",
    lineJoin: "round",
    shadowBlur: 0,
    shadowOffsetY: 5,
    shadowOffsetX: 5,
    shadowOpacity: 1,
    isAllBorderRadius: false,
    borderRadius: 0,
    fontStyle: "Roboto",
    textDecoration: "none",
    fontWeight: "normal",
    fontFamily: "Roboto",
    fontSize: 24,
    text: "",
    children: atom([] as ALL_SHAPES[]),
  };
  const state: ALL_SHAPES = {
    id: "1c46a759-c0f4-4978-8781-5f10ca8cfe8d",
    pageId: "f860ad7b-27ac-491a-ba77-1a81f004dac1",
    state: atom(shape),
    tool: "IMAGE",
  };

  return (
    <Layer id="layer-image-preview" listening={false}>
      <ShapeImage layoutShapes={[]} shape={state} />
    </Layer>
  );
};
