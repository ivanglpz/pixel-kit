import { IShape } from "./type.shape";

type SizeProps = Pick<
  IShape,
  | "fillContainerWidth"
  | "fillContainerHeight"
  | "width"
  | "height"
  | "minWidth"
  | "minHeight"
  | "maxWidth"
  | "maxHeight"
>;

export const sizeStyles = (box: SizeProps): React.CSSProperties => {
  const values = {
    width: box.fillContainerWidth ? "100%" : box.width,
    height: box.fillContainerHeight ? "100%" : box.height,
    minWidth: box.minWidth > 0 ? box.minWidth : undefined,
    minHeight: box.minHeight > 0 ? box.minHeight : undefined,
    maxWidth: box.maxWidth > 0 ? box.maxWidth : undefined,
    maxHeight: box.maxHeight > 0 ? box.maxHeight : undefined,
  };

  // filtra propiedades con undefined
  const filtered = Object.fromEntries(
    Object.entries(values).filter(([_, v]) => v !== undefined)
  ) as React.CSSProperties;

  return filtered;
};
