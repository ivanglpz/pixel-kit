import { PrimitiveAtom, useAtomValue } from "jotai";
import { Group } from "react-konva";
import ShapeBox from "./box.shape";
import { LayoutFlex } from "./layout-flex";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";

// eslint-disable-next-line react/display-name
export const ShapeGroup = ({
  shape: item,
  layoutShapes: SHAPES,
}: IShapeWithEvents) => {
  const box = useAtomValue(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { x, y, height, width, rotation } = box;

  const childrens = useAtomValue(box.children);
  if (!box.visible) return null;

  const layout = box.layouts?.at(0);

  const children = childrens?.map((item) => {
    const Component = Shapes?.[item?.tool] as FCShapeWEvents;
    return (
      <Component
        layoutShapes={SHAPES}
        shape={item}
        key={`pixel-group-shapes-${item?.id}-${item.tool}`}
      />
    );
  });
  return (
    <>
      <ShapeBox shape={item} layoutShapes={[]} />

      <Group
        id={box?.id}
        parentId={box?.parentId}
        x={x}
        y={y}
        width={width}
        height={height}
        listening={!box.isLocked}
        rotation={rotation}
        clip={{
          x: 0,
          y: 0,
          width: width,
          height: height,
        }}
      >
        {layout ? (
          <LayoutFlex width={width} height={height} display="flex" {...layout}>
            {children}
          </LayoutFlex>
        ) : (
          children
        )}
      </Group>
    </>
  );
};
