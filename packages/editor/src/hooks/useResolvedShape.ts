import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { useCallback, useMemo } from "react";
import stageAbsolutePosition from "../helpers/position";
import { usePropertiesShape } from "../hooks/usePropertiesShape";
import { flexLayoutAtom } from "../shapes/layout-flex";
import { IShapeEvents } from "../shapes/type.shape";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import { PLANE_SHAPES_ATOM, RESOLVE_DROP_TARGET } from "../states/shapes";

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
    if (parentId) {
      applyLayout({ id: parentId });
    }
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
