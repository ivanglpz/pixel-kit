/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
import { memo, useCallback, useMemo } from "react";
import { Layer } from "react-konva";
import { useTool } from "../hooks";
import useTemporalShape from "../hooks/temporalShape/hook";
import { IKeyTool } from "../hooks/tool/types";
import { MapEls } from "./mp_el";
import { FCE } from "./type";

const AtomPipeComponent = memo(() => {
  const { temporalShape } = useTemporalShape();
  const { isMoving } = useTool();
  const onChange = useCallback(() => {}, []);

  const Component = useMemo(
    () => MapEls?.[`${temporalShape?.tool}` as IKeyTool] as FCE,
    [temporalShape]
  );

  return (
    <>
      <Layer>
        {temporalShape?.id ? (
          <Component
            key={temporalShape.id}
            {...temporalShape}
            draggable={true}
            isMoving={isMoving}
            isSelected={true}
            onChange={onChange}
            onSelect={onChange}
          />
        ) : null}
      </Layer>
    </>
  );
});
export default AtomPipeComponent;
