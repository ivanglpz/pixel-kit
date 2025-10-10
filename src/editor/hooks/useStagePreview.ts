import { useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { stagePreview } from "../constants/stage-preview";
import ALL_SHAPES_ATOM from "../states/shapes";
import { computeStageTransform } from "../utils/stageTransform";
import { useConfiguration } from "./useConfiguration";

export const useStagePreview = (dimensions?: {
  width: number;
  height: number;
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const { config } = useConfiguration();
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);

  useEffect(() => {
    if (!stageRef.current || !config.expand_stage_resolution) return;
    const stage = stageRef.current;
    const { scale, offsetX, offsetY } = computeStageTransform(
      dimensions ?? config.expand_stage_resolution
    );

    stage.width(stagePreview.width);
    stage.height(stagePreview.height);
    stage.scale({ x: scale, y: scale });
    stage.position({ x: offsetX, y: offsetY });
    stage.batchDraw();
  }, [config.export_mode, ALL_SHAPES, dimensions]);
  return {
    stageRef,
  };
};
