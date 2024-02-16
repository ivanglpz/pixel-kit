/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { Group } from "konva/lib/Group";
import { MutableRefObject, memo, useCallback, useEffect } from "react";
import { Layer, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import { useElement, useSelection, useTool } from "../hooks";
import useElements from "../hooks/elements/hook";
import { CanvasElements } from "../hooks/elements/jotai";
import { IKeyTool } from "../hooks/tool/types";
import { MapEls } from "./mp_el";
import AtomPipeComponent from "./pipe";
import { FCE, IElement, IParamsElement } from "./type";

const AtomEditorMapper = memo(() => {
  const { elements, draggable, handleSetElements } = useElements();
  const { element, handleSetElement } = useElement();
  const { isMoving } = useTool();
  const mapped = useAtomValue(CanvasElements);
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
      handleSetElement(element);
      if (element?.tool === "GROUP") {
      } else {
        handleSetElements(element);
      }
    },
    [isMoving, element, elements]
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
        {mapped?.map((item) => {
          const Component = MapEls?.[`${item?.tool}` as IKeyTool] as FCE;
          const isSelected = item?.id === element?.id;
          return (
            <Component
              {...item}
              key={item?.id}
              draggable={draggable}
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
              element={element}
              elements={[]}
            />
          );
        })}
      </Layer>
      <Layer>
        <Portal selector=".top-layer" enabled={true}>
          <Transformer
            ref={trRef as MutableRefObject<Konva.Transformer>}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
          <Rect
            id="select-rect-default"
            fill="#8A9BA7"
            stroke="#0D99FF"
            strokeWidth={1}
            ref={selectionRectRef as MutableRefObject<Konva.Rect>}
          />
        </Portal>
      </Layer>
      <AtomPipeComponent />
    </>
  );
});

export default AtomEditorMapper;
