import { Layer } from "react-konva";
import useCurrentItem from "../hooks/useCurrentItem";
import { useMemo } from "react";
import { FCShapeWEvents } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";
import useScreen from "../hooks/useScreen";
import { atom } from "jotai";

export const LayerPipe = () => {
  const { temporalShape } = useCurrentItem();
  console.log(temporalShape);

  const Component = useMemo(
    () => Shapes?.[`${temporalShape?.tool}`] as FCShapeWEvents,
    [temporalShape]
  );
  const { width, height } = useScreen();

  if (!temporalShape?.id) return null;

  return (
    <>
      <Layer>
        <Component
          screenHeight={height}
          screenWidth={width}
          key={`pixel-kit-temporal-shape-${temporalShape.id}`}
          shape={atom(temporalShape)}
          draggable={false}
          isSelected={temporalShape?.tool === "TEXT"}
          onClick={() => {}}
          onDragMove={() => {}}
          onDragStart={() => {}}
          onDragStop={() => {}}
          onTransformStop={() => {}}
        />
      </Layer>
    </>
  );
};
