import { IShape } from "./type.shape";

export const apply = {
  backgroundColor: (shape: IShape) => {
    const bg = shape.fills
      ?.filter((e) => e?.type === "fill" && e?.visible)
      ?.at(0)?.color;
    if (!bg) return {};
    return {
      backgroundColor: bg,
    };
  },
  borderRadius: (shape: IShape) => {
    if (shape.isAllBorderRadius) {
      return {
        borderRadius: shape.borderRadius,
      };
    }
    return {
      borderTopLeftRadius: shape.borderTopLeftRadius,
      borderTopRightRadius: shape.borderTopRightRadius,
      borderBottomRightRadius: shape.borderBottomRightRadius,
      borderBottomLeftRadius: shape.borderBottomLeftRadius,
    };
  },
  stroke: (shape: IShape) => {
    if (
      shape.strokeWidth > 0 &&
      shape?.strokes?.filter((e) => e?.visible)?.at(0)
    ) {
      return {
        borderWidth: shape.strokeWidth,
        borderColor: shape?.strokes?.filter((e) => e?.visible)?.at(0)?.color,
      };
    }
    return {};
  },
};
