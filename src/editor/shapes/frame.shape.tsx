import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Group } from "react-konva";
import { ShapeIterator } from "../layers/layer.shapes";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

export const SHAPE_FRAME = (props: IShapeEvents) => {
  const { shape: item } = props;

  const box = useAtomValue(item.state);

  const x = useAtomValue(box.x);
  const y = useAtomValue(box.y);
  const width = useAtomValue(box.width);
  const height = useAtomValue(box.height);
  const isLocked = useAtomValue(box.isLocked);
  const rotation = useAtomValue(box.rotation);
  const visible = useAtomValue(box.visible);
  const childrens = useAtomValue(box.children);
  const parentId = useAtomValue(box.parentId);

  const isLayout = useAtomValue(box.isLayout);
  const justifyContent = useAtomValue(box.justifyContent);
  const alignItems = useAtomValue(box.alignItems);
  const flexDirection = useAtomValue(box.flexDirection);
  const flexWrap = useAtomValue(box.flexWrap);
  const gap = useAtomValue(box.gap);
  const isAllPadding = useAtomValue(box.isAllPadding);
  const padding = useAtomValue(box.padding);
  const paddingTop = useAtomValue(box.paddingTop);
  const paddingRight = useAtomValue(box.paddingRight);
  const paddingBottom = useAtomValue(box.paddingBottom);
  const paddingLeft = useAtomValue(box.paddingLeft);
  const fillContainerWidth = useAtomValue(box.fillContainerWidth);
  const fillContainerHeight = useAtomValue(box.fillContainerHeight);

  const applyLayout = useSetAtom(flexLayoutAtom);

  useEffect(() => {
    if (isLayout) {
      applyLayout({ id: box.id });
    }
  }, [
    isLayout,
    justifyContent,
    alignItems,
    flexDirection,
    flexWrap,
    width,
    height,
    gap,
    isAllPadding,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    fillContainerWidth,
    fillContainerHeight,
    box.id,
  ]);

  if (!visible) return null;

  return (
    <>
      <ShapeBox shape={item} />

      <Group
        id={box?.id}
        parentId={parentId}
        x={x}
        y={y}
        width={width}
        height={height}
        listening={!isLocked}
        rotation={rotation}
        clip={{
          x: 0,
          y: 0,
          width,
          height,
        }}
      >
        {childrens?.map((child, index) => {
          return (
            <ShapeIterator id="pixel-group-shapes" item={child} index={index} />
          );
        })}
      </Group>
    </>
  );
};
