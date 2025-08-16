import { PrimitiveAtom, useAtom } from "jotai";
import { memo } from "react";
import { Group } from "react-konva";
import ShapeBox from "./box.shape";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";

// eslint-disable-next-line react/display-name
export const ShapeGroup = memo(({ item, SHAPES }: IShapeWithEvents) => {
  const [box, setBox] = useAtom(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const {
    x,
    y,

    height,
    width,
  } = box;

  const childrens = SHAPES?.filter((e) => e?.parentId === box?.id);
  return (
    <>
      <ShapeBox item={item} SHAPES={[]} />

      <Group x={x} y={y} width={width} height={height}>
        {childrens?.map((item) => {
          const Component = Shapes?.[item?.tool] as FCShapeWEvents;
          return (
            <Component
              SHAPES={SHAPES}
              item={item}
              key={`pixel-group-shapes-${item?.id}-${item.tool}`}
            />
          );
        })}
      </Group>
    </>
  );
});
