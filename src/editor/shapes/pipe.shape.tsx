/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { memo, useMemo } from "react";
import { Layer } from "react-konva";
import useTemporalShape from "../hooks/temporalShape/hook";
import { IKeyTool } from "../hooks/tool/types";
import { FCShapeWEvents } from "./type.shape";
import { Shapes } from "./shapes";

const PixelTemporalShape = memo(() => {
  const { temporalShape } = useTemporalShape();

  const Component = useMemo(
    () => Shapes?.[`${temporalShape?.tool}` as IKeyTool] as FCShapeWEvents,
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
});
export default PixelTemporalShape;
