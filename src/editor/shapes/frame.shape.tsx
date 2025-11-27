import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { Group } from "react-konva";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { Shapes } from "./shapes";
import { FCShapeWEvents, IShapeEvents } from "./type.shape";

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
  const applyLayout = useSetAtom(flexLayoutAtom);
  const isLayout = useAtomValue(box.isLayout);

  // useEffect(() => {
  //   if (isLayout) {
  //     applyLayout({ id: box.id });
  //   }
  // }, [
  //   isLayout,
  //   // box.isLayout,
  //   // box.justifyContent,
  //   // box.alignItems,
  //   // box.flexDirection,
  //   // box.flexWrap,
  //   // box.width,
  //   // box.height,
  //   // box.gap,
  //   // box.id,
  //   // box.isAllPadding,
  //   // box.padding,
  //   // box.paddingTop,
  //   // box.paddingRight,
  //   // box.paddingBottom,
  //   // box.paddingLeft,
  //   // box.fillContainerWidth,
  //   // box.fillContainerHeight,
  //   // childrens,
  // ]);

  if (!visible) return null;

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
          width: width,
          height: height,
        }}
      >
        {children}
      </Group>
    </>
  );
};
