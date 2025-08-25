import { PrimitiveAtom, useAtomValue } from "jotai";
import { memo } from "react";
import { Group, Rect, Text } from "react-konva";
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
export const ShapeGroup = memo(
  ({ shape: item, listShapes: SHAPES }: IShapeWithEvents) => {
    const box = useAtomValue(
      item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
    );

    const { x, y, height, width, rotation } = box;

    const childrens = SHAPES?.filter((e) => e?.parentId === box?.id);
    if (!box.visible) return null;

    const layout = box.layouts?.at(0);

    const children = childrens?.map((item) => {
      const Component = Shapes?.[item?.tool] as FCShapeWEvents;
      return (
        <Component
          listShapes={SHAPES}
          shape={item}
          key={`pixel-group-shapes-${item?.id}-${item.tool}`}
        />
      );
    });
    return (
      <>
        <ShapeBox shape={item} listShapes={[]} />

        <Group
          {...box}
          x={x}
          y={y}
          width={width}
          height={height}
          listening={!box.isLocked}
          rotation={rotation}
          draggable
          tag={box?.tool}
          clip={{
            x: 0,
            y: 0,
            width: width,
            height: height,
          }}
        >
          <Text
            x={0}
            y={0}
            text={box.id}
            fontSize={24}
            fontFamily="Arial"
            fill="black"
          ></Text>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            listening={false}
          />
          {layout ? (
            <LayoutFlex
              width={width}
              height={height}
              display="flex"
              {...layout}
            >
              {children}
            </LayoutFlex>
          ) : (
            children
          )}
        </Group>
      </>
    );
  }
);
