import { atom } from "jotai";
/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { formats } from "../constants/formats";
import {
  attachShapeRecursively,
  createStagesFromShapes,
  exportAndDownloadStages,
} from "../utils/export";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "./shape";
import ALL_SHAPES_ATOM, {
  computeStageBounds,
  PLANE_SHAPES_ATOM,
} from "./shapes";

export const TYPE_EXPORT_ATOM = atom("HIGH");

export const EXPORT_SHAPES = atom(null, async (get, set) => {
  const selectedIds = get(SELECTED_SHAPES_BY_IDS_ATOM);
  const planeShapes = get(PLANE_SHAPES_ATOM);
  const format = get(TYPE_EXPORT_ATOM);
  const shapes = planeShapes.filter((shape) =>
    selectedIds.some(
      (selected) =>
        shape.id === selected.id &&
        get(get(shape.state).parentId) === selected.parentId,
    ),
  );
  const stagesWithContainers = await createStagesFromShapes(shapes, { get });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const stages = stagesWithContainers.map((s) => s.stage);

  exportAndDownloadStages(
    stages,
    "png",
    formats[format as keyof typeof formats],
  );
});
export const GENERATE_PREVIEW_ATOM = atom(
  null,
  async (get): Promise<string> => {
    const roots = get(ALL_SHAPES_ATOM);

    const bounds = computeStageBounds(get)(roots);
    const container = document.createElement("div");
    const MARGIN = 40; // px

    const width = bounds.width + MARGIN * 2;
    const height = bounds.height + MARGIN * 2;

    container.style.width = `${width}px`;
    container.style.height = `${height}px`;

    const stage = new Konva.Stage({
      container,
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    });

    const layer = new Konva.Layer();
    layer.x(-bounds.startX + MARGIN);
    layer.y(-bounds.startY + MARGIN);

    stage.add(layer);
    for (const element of roots) {
      await attachShapeRecursively(element, layer, { get }, false);
    }
    layer.draw();

    const dataURL = stage.toDataURL({
      mimeType: "image/png",
      pixelRatio: 0.3,
    });
    return dataURL;
  },
);
