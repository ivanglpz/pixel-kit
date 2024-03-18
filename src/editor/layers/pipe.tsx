import { Layer } from "react-konva";
import useTemporalShape from "../hooks/temporalShape/hook";
import { useMemo } from "react";
import { FCShapeWEvents } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";

export const LayerPipe = () => {
  const { temporalShape } = useTemporalShape();

  const Component = useMemo(
    () => Shapes?.[`${temporalShape?.tool}`] as FCShapeWEvents,
    [temporalShape]
  );

  return (
    <>
      <Layer>
        {temporalShape?.id ? (
          <Component
            key={`pixel-kit-temporal-shape-${temporalShape.id}`}
            shape={temporalShape}
            draggable={true}
            isSelected={true}
            onClick={() => {}}
            onDragMove={() => {}}
            onDragStart={() => {}}
            onDragStop={() => {}}
            onTransformStop={() => {}}
          />
        ) : null}
      </Layer>
    </>
  );
};
