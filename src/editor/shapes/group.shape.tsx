import { PrimitiveAtom, useAtomValue } from "jotai";
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
export const ShapeGroup = memo(
  ({ shape: item, listShapes: SHAPES }: IShapeWithEvents) => {
    const box = useAtomValue(
      item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
    );

    const { x, y, height, width } = box;

    const childrens = SHAPES?.filter((e) => e?.parentId === box?.id);
    if (!box.visible) return null;
    return (
      <>
        <ShapeBox shape={item} listShapes={[]} />

        <Group
          x={x}
          y={y}
          width={width}
          height={height}
          listening={!box.isLocked}
        >
          {childrens?.map((item) => {
            const Component = Shapes?.[item?.tool] as FCShapeWEvents;
            return (
              <Component
                listShapes={SHAPES}
                shape={item}
                key={`pixel-group-shapes-${item?.id}-${item.tool}`}
              />
            );
          })}
        </Group>
      </>
    );
  }
);
