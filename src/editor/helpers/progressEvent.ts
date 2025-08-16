import { IShape } from "@/editor/shapes/type.shape";
import { IKeyMethods } from "../states/tool";

const isNotNegative = (value: number) => {
  return value < 1 ? 1 : value;
};
export type IShapeProgressEvent = {
  [key in IKeyMethods]: (x: number, y: number, element: IShape) => IShape;
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
    borderRadius:
      element?.tool === "CIRCLE"
        ? isNotNegative(Number(element?.width) / 2)
        : 0,
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
    borderRadius: isNotNegative(Number(element?.width) / 2),
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
  GROUP: shapeBoxProgress,
};
