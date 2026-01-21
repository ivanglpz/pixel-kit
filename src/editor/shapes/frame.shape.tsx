import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { Group } from "react-konva";
import { useResolvedShape } from "../hooks/useResolvedShape";
import { ShapeIterator } from "../layers/layer.shapes";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { IShapeEvents } from "./type.shape";

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
