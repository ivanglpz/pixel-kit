/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { memo, useCallback } from "react";
import { Group, Layer } from "react-konva";
import { Portal } from "react-konva-utils";
import { useTool } from "../hooks";
import useShapes from "../hooks/elements/hook";
import useTemporalShape from "../hooks/pipe/hook";
import { IKeyTool } from "../hooks/tool/types";
import { MapEls } from "./mp_el";
import { FCE } from "./type";

const AtomPipeComponent = memo(() => {
  const { temporalShape } = useTemporalShape();
  const { draggable } = useShapes();
  const { isMoving } = useTool();
  const onChange = useCallback(() => {}, []);

  const Component = MapEls?.[`${temporalShape?.tool}` as IKeyTool] as FCE;
  return (
    <>
      {Component ? (
        <Layer>
          <Portal selector=".top-layer" enabled={true}>
            <Component
              key={temporalShape.id}
              {...temporalShape}
              draggable={draggable}
              isMoving={isMoving}
              isSelected={true}
              onChange={onChange}
              onSelect={onChange}
              elements={[]}
              element={temporalShape}
            />
            );
          </Portal>
        </Layer>
      ) : null}
    </>
  );
});
export default AtomPipeComponent;
