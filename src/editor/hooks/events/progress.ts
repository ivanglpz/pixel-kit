import { IElement } from "@/editor/elements/type";
import { IShapeProgressEvent } from "./types";

const isNotNegative = (value: number) => {
  return value < 1 ? 1 : value;
};

export const shapeBoxProgress = (
  x: number,
  y: number,
  element: IElement
): IElement => {
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
  element: IElement
): IElement => {
  return Object.assign({}, element, {
    width: isNotNegative(x - Number(element?.x)),
    height: isNotNegative(x - Number(element?.x)),
  });
};
export const shapeDrawProgress = (
  x: number,
  y: number,
  element: IElement
): IElement => {
  if (!element?.points) {
    return element;
  }

  return {
    ...element,
    points: [...element?.points, x, y],
  };
};

export const shapeProgressEvent: IShapeProgressEvent = {
  BOX: shapeBoxProgress,
  CIRCLE: shapeBoxProgress,
  CODE: shapeBoxProgress,
  DRAW: shapeDrawProgress,
  IMAGE: shapeBoxProgress,
  TEXT: shapeBoxProgress,
  LINE: shapeBoxProgress,
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
