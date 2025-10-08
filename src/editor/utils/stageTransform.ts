import { stagePreview } from "../constants/stage-preview";

export const computeStageTransform = (shape: {
  width: number;
  height: number;
}) => {
  const contentWidth = Number(shape?.width) || 0;
  const contentHeight = Number(shape?.height) || 0;
  if (!contentWidth || !contentHeight)
    return { scale: 1, offsetX: 0, offsetY: 0 };

  const scale = Math.min(
    stagePreview.width / contentWidth,
    stagePreview.height / contentHeight
  );
  const offsetX = (stagePreview.width - contentWidth * scale) / 2;
  const offsetY = (stagePreview.height - contentHeight * scale) / 2;

  return {
    scale,
    offsetX,
    offsetY,
    width: contentWidth * scale,
    height: contentHeight * scale,
  };
};
