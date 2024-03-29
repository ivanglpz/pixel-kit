import { IShape } from "@/editor/shapes/type.shape";
import { IShapeProgressEvent } from "./types";

const isNotNegative = (value: number) => {
  return value < 1 ? 1 : value;
};

export const shapeBoxProgress = (
  x: number,
  y: number,
  element: IShape
): IShape => {
  const isHeight = isNotNegative(x - Number(element?.x));
  const isWidth = isNotNegative(y - Number(element?.y));
  return Object.assign({}, element, {
    width: isHeight,
    height: isWidth,
  });
};
export const shapeCircleProgress = (
  x: number,
  y: number,
  element: IShape
): IShape => {
  return Object.assign({}, element, {
    width: isNotNegative(x - Number(element?.x)),
    height: isNotNegative(x - Number(element?.x)),
  });
};
export const shapeDrawProgress = (
  x: number,
  y: number,
  element: IShape
): IShape => {
  if (!element?.points) {
    return element;
  }

  return element;
};

export const shapeProgressEvent: IShapeProgressEvent = {
  BOX: shapeBoxProgress,
  CIRCLE: shapeBoxProgress,
  CODE: shapeBoxProgress,
  DRAW: shapeDrawProgress,
  IMAGE: shapeBoxProgress,
  TEXT: shapeBoxProgress,
  LINE: shapeBoxProgress,
  EXPORT: shapeBoxProgress,
};

// export const shapeLineProgress = (
//   x: number,
//   y: number,
//   element: IElement
// ): IElement => {
//   return Object.assign({}, element, {
//     width: x - Number(element?.x),
//     height: y - Number(element?.y),
//   });
// };
