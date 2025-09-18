import { PrimitiveAtom, useAtomValue } from "jotai";
import { Group } from "react-konva";
import { Html } from "react-konva-utils";
import { ChatSmallAI } from "../components/SmallChatAI";
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
export const ShapeGroup = ({ shape: item }: IShapeWithEvents) => {
  const box = useAtomValue(
    item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
  );

  const { x, y, height, width, rotation } = box;

  const childrens = useAtomValue(box.children);
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
        {box.isLayout ? (
          <LayoutFlex
            width={width}
            height={height}
            display="flex"
            alignItems={box.alignItems}
            flexDirection={box.flexDirection}
            flexWrap={box.flexWrap}
            gap={box.gap}
            justifyContent={box.justifyContent}
            shape={box}
          >
            {children}
          </LayoutFlex>
        ) : (
          children
        )}
      </Group>
      <Html
        divProps={{
          style: {
            position: "absolute",
            top: y + "px",
            left: width + x + 10 + "px",
          },
        }}
      >
        <ChatSmallAI />
      </Html>
    </>
  );
};
