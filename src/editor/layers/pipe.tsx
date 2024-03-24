import { Layer } from "react-konva";
import useTemporalShape from "../hooks/temporalShape/hook";
import { useMemo } from "react";
import { FCShapeWEvents } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";
import useScreen from "../hooks/screen";

export const LayerPipe = () => {
  const { temporalShape } = useTemporalShape();

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
          shape={temporalShape}
          draggable={false}
          isSelected={false}
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
