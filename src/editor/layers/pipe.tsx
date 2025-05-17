import { Layer } from "react-konva";
import useCurrentItem from "../hooks/useCurrentItem";
import { useMemo } from "react";
import { FCShapeWEvents } from "../shapes/type.shape";
import { Shapes } from "../shapes/shapes";
import { atom, useAtomValue } from "jotai";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";

export const LayerPipe = () => {
  const { temporalShape } = useCurrentItem();

  const Component = useMemo(
    () => Shapes?.[`${temporalShape?.tool}`] as FCShapeWEvents,
    [temporalShape]
  );

  const { height, width } = useAtomValue(STAGE_DIMENSION_ATOM);

  if (!temporalShape?.id) return null;

  return (
    <>
      <Layer id="layer-pipe-shapes">
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
