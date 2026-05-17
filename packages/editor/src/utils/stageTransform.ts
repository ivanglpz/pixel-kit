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

export const computeStageBoundsTransform = (content: {
  width: number;
  height: number;
  startX?: number;
  startY?: number;
}) => {
  const contentWidth = Number(content.width) || 0;
  const contentHeight = Number(content.height) || 0;
  const contentOffsetX = Number(content.startX) || 0;
  const contentOffsetY = Number(content.startY) || 0;

  if (!contentWidth || !contentHeight)
    return { scale: 1, offsetX: 0, offsetY: 0 };

  // Calculamos la escala para que todo el contenido sea visible
  const scale =
    Math.min(
      stagePreview.width / contentWidth,
      stagePreview.height / contentHeight,
      1 // limitamos el zoom máximo
    ) * 0.9; // margen

  // Centro del viewport
  const viewportCenterX = stagePreview.width / 2;
  const viewportCenterY = stagePreview.height / 2;

  // Centro del contenido
  const contentCenterX = contentOffsetX + contentWidth / 2;
  const contentCenterY = contentOffsetY + contentHeight / 2;

  // Posición final del stage para centrar
  const offsetX = viewportCenterX - contentCenterX * scale;
  const offsetY = viewportCenterY - contentCenterY * scale;

  return {
    scale,
    offsetX,
    offsetY,
    width: contentWidth * scale,
    height: contentHeight * scale,
  };
};
