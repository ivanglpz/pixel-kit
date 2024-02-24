/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { MutableRefObject, memo, useCallback, useEffect } from "react";
import { Layer, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import { useSelectedShape, useSelection, useTool } from "../hooks";
import useShapes from "../hooks/elements/hook";
import { IKeyTool } from "../hooks/tool/types";
import { MapEls } from "./mp_el";
import AtomPipeComponent from "./pipe";
import { FCE, IElement, IParamsElement } from "./type";

const AtomEditorMapper = memo(() => {
  const { shapes } = useShapes();
  const { element, handleSetElement } = useSelectedShape();
  const { isMoving } = useTool();
  const {
    selectionRectRef,
    trRef,
    selectionRef,
    setSelectionRefs,
    layerRef,
    setSelected,
  } = useSelection();

  const onChange = useCallback(
    (element: IElement | IParamsElement) => {
      if (!element.id) return;
    },
    [isMoving, element]
  );

  useEffect(() => {
    setSelectionRefs({
      rectRef: selectionRectRef,
      trRef,
      selection: selectionRef,
      layerRef,
    });
  }, []);

  return (
    <>
      <Layer ref={layerRef as MutableRefObject<Konva.Layer>}>
        {Object.values(shapes)?.map((item) => {
          const Component = MapEls?.[`${item?.tool}` as IKeyTool] as FCE;
          const isSelected = item?.id === element?.id;
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
                setSelected(false);
                trRef?.current?.nodes?.([]);
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
