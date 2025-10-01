import { PrimitiveAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Group } from "react-konva";
import { SHAPE_IDS_ATOM } from "../states/shape";
import ShapeBox from "./box.shape";
import { flexLayoutAtom } from "./layout-flex";
import { Shapes } from "./shapes";
import {
  FCShapeWEvents,
  IShape,
  IShapeWithEvents,
  WithInitialValue,
} from "./type.shape";

// eslint-disable-next-line react/display-name
export const SHAPE_FRAME = (props: IShapeWithEvents) => {
  const { shape: item } = props;
  const box = useAtomValue(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );
  const shapeId = useAtomValue(SHAPE_IDS_ATOM);
  // const isSelected = shapeId.some((w) => w.id === box.id);
  const { x, y, height, width, rotation } = box;

  const childrens = useAtomValue(box.children);

  const applyLayout = useSetAtom(flexLayoutAtom);

  // Aplicar el layout cada vez que cambien las props o children
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

  const children = childrens?.map((item) => {
    const Component = Shapes?.[item?.tool] as FCShapeWEvents;
    return (
      <Component
        shape={item}
        key={`pixel-group-shapes-${item?.id}-${item.tool}`}
      />
    );
  });

  return (
    <>
      <ShapeBox shape={item} />

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
        {children}
      </Group>
    </>
  );
};
