import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { Group } from "react-konva";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeEvents,
  WithInitialValue,
} from "./type.shape";

export const SHAPE_FRAME = (props: IShapeEvents) => {
  const { shape: item } = props;
  const box = useAtomValue(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const childrens = useAtomValue(box.children);

  const applyLayout = useSetAtom(flexLayoutAtom);

  useEffect(() => {
    if (box.isLayout) {
      applyLayout({ id: box.id });
    }
  }, [
    box.isLayout,
    box.justifyContent,
    box.alignItems,
    box.flexDirection,
    box.flexWrap,
    box.width,
    box.height,
    box.gap,
    box.id,
    box.isAllPadding,
    box.padding,
    box.paddingTop,
    box.paddingRight,
    box.paddingBottom,
    box.paddingLeft,
  ]);

  if (!box.visible) return null;

  const children = useMemo(
    () =>
      childrens?.map((item) => {
        const Component = Shapes?.[item?.tool] as FCShapeWEvents;
        return (
          <Component
            shape={item}
            key={`pixel-group-shapes-${item?.id}-${item.tool}`}
          />
        );
      }),
    [childrens]
  );

  return (
    <>
      <ShapeBox shape={item} />

      <Group
        id={box?.id}
        parentId={box?.parentId}
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        listening={!box.isLocked}
        rotation={box.rotation}
        clip={{
          x: 0,
          y: 0,
          width: box.width,
          height: box.height,
        }}
      >
        {children}
      </Group>
    </>
  );
};
