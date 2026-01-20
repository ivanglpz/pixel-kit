import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { useCallback, useEffect, useMemo } from "react";
import { Group } from "react-konva";
import stageAbsolutePosition from "../helpers/position";
import { ShapeIterator } from "../layers/layer.shapes";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import {
  ALL_SHAPES,
  PLANE_SHAPES_ATOM,
  RESOLVE_DROP_TARGET,
} from "../states/shapes";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

const usePropertiesShape = (props: ALL_SHAPES) => {
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
const MIN_SHAPE_SIZE = 5;

export const useResolvedShape = (props: IShapeEvents) => {
  const { shape: instance } = props;
  const SHAPE = useAtomValue(instance.state);
  const sourceShapeId = useAtomValue(SHAPE.sourceShapeId);
  const PLANE = useAtomValue(PLANE_SHAPES_ATOM);
  const principalParentId = useAtomValue(SHAPE.parentId);
  const principalX = useAtomValue(SHAPE.x);
  const principalY = useAtomValue(SHAPE.y);
  const principalWidth = useAtomValue(SHAPE.width);
  const principalHeight = useAtomValue(SHAPE.height);
  const principalIsLocked = useAtomValue(SHAPE.isLocked);
  const isComponent = useAtomValue(SHAPE.isComponent);
  const label = useAtomValue(SHAPE.label);
  const setDropCoords = useSetAtom(RESOLVE_DROP_TARGET);
  const parentId = useAtomValue(SHAPE.parentId);
  const setRotation = useSetAtom(SHAPE.rotation);
  const setX = useSetAtom(SHAPE.x);
  const setY = useSetAtom(SHAPE.y);
  const setWidth = useSetAtom(SHAPE.width);
  const setHeight = useSetAtom(SHAPE.height);
  const applyLayout = useSetAtom(flexLayoutAtom);
  const [shapeId, setShapeId] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const isSelected = useMemo(
    () => shapeId.some((w) => w.id === instance.id),
    [shapeId, instance.id],
  );

  const onDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    setX(e.target.x());
    setY(e.target.y());
  }, []);

  const onClick = () => {
    setShapeId({
      id: instance?.id,
      parentId: parentId,
    });
  };
  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const { x, y } = stageAbsolutePosition(e);
    setDropCoords({ x, y });

    if (parentId) {
      applyLayout({ id: parentId });
    }
  };

  const onTransform = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    setRotation(node.rotation());
    setWidth(Math.max(MIN_SHAPE_SIZE, node.width() * scaleX));
    setHeight(Math.max(MIN_SHAPE_SIZE, node.height() * scaleY));
  };

  const onTransformEnd = () => {
    if (parentId) {
      applyLayout({ id: parentId });
    }
  };

  const listening = useMemo(() => {
    if (props?.options?.isLocked) {
      return false;
    }
    return !principalIsLocked;
  }, [props?.options?.isLocked, principalIsLocked]);

  // Buscar el shape espejo si existe sourceShapeId
  const SHAPE_MIRROR = useMemo(() => {
    if (!sourceShapeId) return null;
    return PLANE.find((e) => e.id === sourceShapeId);
  }, [sourceShapeId, PLANE]);

  const mirrorProps = usePropertiesShape(SHAPE_MIRROR ?? instance);

  return {
    ...mirrorProps,
    id: SHAPE.id, // Mantener el ID original
    parentId: principalParentId,
    x: principalX,
    y: principalY,
    width: principalWidth,
    height: principalHeight,
    isLocked: principalIsLocked,
    setRotation,
    isComponent,
    label,
    setY,
    setX,
    setWidth,
    setHeight,
    sourceShapeId,
    isSelected,
    listening,
    events: {
      onDragMove,
      onDragEnd,
      onTransform,
      onTransformEnd,
      onClick,
    },
  };
};

export const SHAPE_FRAME = (props: IShapeEvents) => {
  const { shape: item } = props;
  const shape = useResolvedShape(props);

  const applyLayout = useSetAtom(flexLayoutAtom);

  useEffect(() => {
    if (shape.isLayout) {
      applyLayout({ id: shape.id });
    }
  }, [
    shape.isLayout,
    shape.justifyContent,
    shape.alignItems,
    shape.flexDirection,
    shape.flexWrap,
    shape.width,
    shape.height,
    shape.gap,
    shape.isAllPadding,
    shape.padding,
    shape.paddingTop,
    shape.paddingRight,
    shape.paddingBottom,
    shape.paddingLeft,
    shape.fillContainerWidth,
    shape.fillContainerHeight,
    shape.id,
  ]);

  if (!shape.visible) return null;

  return (
    <>
      <ShapeBox shape={item} options={props?.options} />

      <Group
        id={shape?.id}
        parentId={shape.parentId}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        listening={!shape.isLocked}
        rotation={shape.rotation}
        clip={{
          x: 0,
          y: 0,
          width: shape.width,
          height: shape.height,
        }}
      >
        {shape.childrens?.map((child, index) => {
          return (
            <ShapeIterator
              key={`pixel-kit-group-shapes-${item?.id}-${index}`}
              item={child}
              options={{
                isLocked:
                  props?.options?.isLocked || Boolean(shape?.sourceShapeId),
                background: shape?.fillColor,
                showLabel: false,
              }}
            />
          );
        })}
      </Group>
    </>
  );
};
