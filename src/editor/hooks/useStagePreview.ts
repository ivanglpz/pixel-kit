import { useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { stagePreview } from "../constants/stage-preview";
import { SHAPE_SELECTED_ATOM } from "../states/shape";
import ALL_SHAPES_ATOM, { STAGE_BOUNDS } from "../states/shapes";
import { getShapesBounds } from "../utils/getBounds";
import { computeStageBoundsTransform } from "../utils/stageTransform";
import { useConfiguration } from "./useConfiguration";

export const useStagePreview = ({ type }: { type: "SHAPES" | "STAGE" }) => {
  const stageRef = useRef<Konva.Stage>(null);
  const { config } = useConfiguration();
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const bounds = useAtomValue(STAGE_BOUNDS);
  const { shapes } = useAtomValue(SHAPE_SELECTED_ATOM);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    if (type === "SHAPES" && shapes) {
      const { scale, offsetX, offsetY } = computeStageBoundsTransform(
        getShapesBounds(shapes)
      );

      stage.width(stagePreview.width);
      stage.height(stagePreview.height);
      stage.scale({ x: scale, y: scale });
      stage.position({ x: offsetX, y: offsetY });
      stage.batchDraw();
    }
    if (type === "STAGE") {
      if (!bounds) return;
      const { scale, offsetX, offsetY } = computeStageBoundsTransform(bounds);

      stage.width(stagePreview.width);
      stage.height(stagePreview.height);
      stage.scale({ x: scale, y: scale });
      stage.position({ x: offsetX, y: offsetY });
      stage.batchDraw();
    }
  }, [config.export_mode, ALL_SHAPES, type, shapes, bounds]);
  return {
    stageRef,
  };
};
