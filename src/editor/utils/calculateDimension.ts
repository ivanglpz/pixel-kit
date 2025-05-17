export const calculateDimension = (
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number
) => {
  const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

  const newWidth = imageWidth * scale;
  const newHeight = imageHeight * scale;
  const x = (canvasWidth - newWidth) / 2;
  const y = (canvasHeight - newHeight) / 2;
  return {
    x,
    y,
    width: newWidth,
    height: newHeight,
  };
};
