import { useAtomValue } from "jotai";
import { ALL_SHAPES } from "../states/shapes";

export const usePropertiesShape = (props: ALL_SHAPES) => {
  const SHAPE = useAtomValue(props.state);
  const rotation = useAtomValue(SHAPE.rotation);
  const x = useAtomValue(SHAPE.x);
  const y = useAtomValue(SHAPE.y);
  const width = useAtomValue(SHAPE.width);
  const height = useAtomValue(SHAPE.height);
  const visible = useAtomValue(SHAPE.visible);
  const isLocked = useAtomValue(SHAPE.isLocked);
  const shadowColor = useAtomValue(SHAPE.shadowColor);
  const strokeColor = useAtomValue(SHAPE.strokeColor);
  const fillColor = useAtomValue(SHAPE.fillColor);
  const parentId = useAtomValue(SHAPE.parentId);
  const strokeWidth = useAtomValue(SHAPE.strokeWidth);
  const dash = useAtomValue(SHAPE.dash);
  const isAllBorderRadius = useAtomValue(SHAPE.isAllBorderRadius);
  const borderTopLeftRadius = useAtomValue(SHAPE.borderTopLeftRadius);
  const borderTopRightRadius = useAtomValue(SHAPE.borderTopRightRadius);
  const borderBottomRightRadius = useAtomValue(SHAPE.borderBottomRightRadius);
  const borderBottomLeftRadius = useAtomValue(SHAPE.borderBottomLeftRadius);
  const borderRadius = useAtomValue(SHAPE.borderRadius);
  const shadowOpacity = useAtomValue(SHAPE.shadowOpacity);
  const shadowOffsetX = useAtomValue(SHAPE.shadowOffsetX);
  const shadowOffsetY = useAtomValue(SHAPE.shadowOffsetY);
  const shadowBlur = useAtomValue(SHAPE.shadowBlur);
  const opacity = useAtomValue(SHAPE.opacity);
  const childrens = useAtomValue(SHAPE.children);
  const isLayout = useAtomValue(SHAPE.isLayout);
  const justifyContent = useAtomValue(SHAPE.justifyContent);
  const alignItems = useAtomValue(SHAPE.alignItems);
  const flexDirection = useAtomValue(SHAPE.flexDirection);
  const flexWrap = useAtomValue(SHAPE.flexWrap);
  const gap = useAtomValue(SHAPE.gap);
  const isAllPadding = useAtomValue(SHAPE.isAllPadding);
  const padding = useAtomValue(SHAPE.padding);
  const paddingTop = useAtomValue(SHAPE.paddingTop);
  const paddingRight = useAtomValue(SHAPE.paddingRight);
  const paddingBottom = useAtomValue(SHAPE.paddingBottom);
  const paddingLeft = useAtomValue(SHAPE.paddingLeft);
  const fillContainerWidth = useAtomValue(SHAPE.fillContainerWidth);
  const fillContainerHeight = useAtomValue(SHAPE.fillContainerHeight);
  const points = useAtomValue(SHAPE.points);
  const IMG = useAtomValue(SHAPE.image);
  const fontFamily = useAtomValue(SHAPE.fontFamily);
  const fontVariant = useAtomValue(SHAPE.fontWeight);
  const text = useAtomValue(SHAPE.text);
  const fontSize = useAtomValue(SHAPE.fontSize);
  const label = useAtomValue(SHAPE.label);
  const isComponent = useAtomValue(SHAPE.isComponent);
  return {
    id: SHAPE.id,
    rotation,
    x,
    y,
    width,
    height,
    points,
    visible,
    isLocked,
    shadowColor,
    strokeColor,
    fillColor,
    parentId,
    strokeWidth,
    dash,
    isAllBorderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderRadius,
    shadowOpacity,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    opacity,
    childrens,
    isLayout,
    justifyContent,
    alignItems,
    flexDirection,
    flexWrap,
    gap,
    isAllPadding,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    fillContainerWidth,
    fillContainerHeight,
    IMG,
    fontFamily,
    fontVariant,
    text,
    fontSize,
    label,
    isComponent,
  };
};
