import { IShape } from "../shapes/type.shape";

export const getShapesBounds = (shapes: IShape[]) => {
  if (!shapes.length)
    return { width: 1000, height: 1000, startX: 0, startY: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  shapes.forEach((shape) => {
    const { x, y, width, height } = shape;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  return {
    width: maxX - minX,
    height: maxY - minY,
    startX: minX,
    startY: minY,
  };
};
