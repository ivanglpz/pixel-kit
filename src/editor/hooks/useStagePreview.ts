import { useAtomValue } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { stagePreview } from "../constants/stage-preview";
import ALL_SHAPES_ATOM, { STAGE_BOUNDS } from "../states/shapes";
import {
  computeStageBoundsTransform,
  computeStageTransform,
} from "../utils/stageTransform";
import { useConfiguration } from "./useConfiguration";

export const useStagePreview = ({
  type,
  dimensions,
}: {
  type: "SHAPE" | "STAGE";
  dimensions?: {
    width: number;
    height: number;
  };
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const { config } = useConfiguration();
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const bounds = useAtomValue(STAGE_BOUNDS);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;

    if (type === "SHAPE" && dimensions) {
      const { scale, offsetX, offsetY } = computeStageTransform(dimensions);

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
  }, [config.export_mode, ALL_SHAPES, type, dimensions, bounds]);
  return {
    stageRef,
  };
};
