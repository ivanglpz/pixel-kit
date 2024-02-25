/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { memo, useCallback } from "react";
import { Layer } from "react-konva";
import { useSelectedShape, useTool } from "../hooks";
import useShapes from "../hooks/shapes/hook";
import { IKeyTool } from "../hooks/tool/types";
import { MapEls } from "./mp_el";
import AtomPipeComponent from "./pipe";
import { FCE, IElement, IParamsElement } from "./type";

const AtomEditorMapper = memo(() => {
  const { shapes } = useShapes();
  const { shapeSelected, handleSetShapeSelected } = useSelectedShape();
  const { isMoving } = useTool();

  const onChange = useCallback(
    (element: IElement | IParamsElement) => {
      if (!element.id) return;
    },
    [isMoving, shapeSelected]
  );

  return (
    <>
      <Layer>
        {Object.values(shapes)?.map((item) => {
          const Component = MapEls?.[`${item?.tool}` as IKeyTool] as FCE;
          const isSelected = item?.id === shapeSelected?.id;
          return (
            <Component
              {...item}
              key={item?.id}
              draggable={true}
              isMoving={isMoving}
              isSelected={isSelected}
              isRef={false}
              onChange={(item) => {
                onChange?.(item);
              }}
              onRef={(ref) => {}}
              onSelect={() => {
                onChange(item);
              }}
            />
          );
        })}
      </Layer>
      <AtomPipeComponent />
    </>
  );
});

export default AtomEditorMapper;
