import { parseColorToRgba } from "../utils/parseColorToRgba";
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
  color: (shape: IShape) => {
    const bg = shape.fills
      ?.filter((e) => e?.type === "fill" && e?.visible)
      ?.at(0)?.color;
    if (!bg) return {};
    return {
      color: bg,
    };
  },
  textShadow: (shape: IShape) => {
    const shadows = shape.effects.filter(
      (e) => e.visible && e.type === "shadow"
    );
    const shadow = shadows.at(0);
    if (shadow) {
      const { shadowOffsetX, shadowOffsetY, shadowBlur, shadowOpacity } = shape;
      const textShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${parseColorToRgba(
        shadow.color,
        shadowOpacity
      )}`;
      return { textShadow };
    }
    return {};
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
  strokeDash: (shape: IShape) => {
    if (shape.dash > 0) {
      return {
        borderStyle: "dashed",
        // border-width: 2px;
        // border-style: dashed;
        // border-color: black;
      };
    }
    return {};
  },
  stroke: (shape: IShape) => {
    if (
      shape.strokeWidth > 0 &&
      shape?.strokes?.filter((e) => e?.visible)?.at(0)
    ) {
      return {
        border: `${shape.strokeWidth}px solid ${shape?.strokes?.filter((e) => e?.visible)?.at(0)?.color}`,
        // borderWidth: shape.strokeWidth,
        // borderColor: shape?.strokes?.filter((e) => e?.visible)?.at(0)?.color,
      };
    }
    return {};
  },
  shadow: (shape: IShape) => {
    const shadows = shape.effects.filter(
      (e) => e.visible && e.type === "shadow"
    );
    const shadow = shadows.at(0);
    if (shadow) {
      const { shadowOffsetX, shadowOffsetY, shadowBlur, shadowOpacity } = shape;
      const boxShadow = `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${parseColorToRgba(
        shadow.color,
        shadowOpacity
      )}`;
      return {
        boxShadow,
      };
    }
    return {};
  },
  flex: (shape: IShape) => {
    if (shape.isLayout) {
      return {
        display: "flex",
        alignItems: shape.alignItems,
        justifyContent: shape.justifyContent,
        flexDirection: shape.flexDirection,
        flexWrap: shape.flexWrap,
        gap: shape.gap,
      };
    }
    return {};
  },
  padding: (shape: IShape) => {
    if (shape.isAllPadding) {
      return {
        padding: shape.padding,
      };
    }
    return {
      paddingTop: shape.paddingTop,
      paddingBottom: shape.paddingBottom,
      paddingLeft: shape.paddingLeft,
      paddingRight: shape.paddingRight,
    };
  },
};
