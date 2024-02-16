/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { IPELMT } from "../../elements/type";
import absolutePositionFromStage from "../../helpers/stage/position";
import useElement from "../element/hook";
import useElements from "../elements/hook";
import usePages from "../pages/hook";
import usePipe from "../pipe/hook";
import useSelection from "../selection/hook";
import useTool from "../tool/hook";
import { IKeyTool } from "../tool/types";
import eventElements from "./event";
import { IEndEvent, IStageEvents, IStartEvent } from "./types";

const useEvent = () => {
  const { isCreatingElement, tool, setTool, disableKeyBoard } = useTool();
  const {
    elements: AllElements,
    handleSetElements: handleCreateElementInAllElements,
    handleDeleteElement: handleDeleteElement,
    handleDeleteManyElements,
  } = useElements();

  const {
    element: elementSelected,
    handleSetElement: handleSelectElement,
    handleEmptyElement: handleCleanSelectedElement,
  } = useElement();
  const {
    pipeline: elementWithPipeline,
    handleSetElement: handlePipelineSetElement,
    handleEmptyElement: handleCleanPipelineSelectedElement,
  } = usePipe();

  const {
    selectionRefsState: { rectRef: selectionRectRef, layerRef, trRef },
    selectionRef: selection,
    setSelected,
    isSelected: isThereMoreSelectedElements,
  } = useSelection();

  const { page } = usePages();
  const stageDataRef = useRef<Konva.Stage>(null);

  const [drawing, setDraw] = useState(false);
  const [eventsKeyboard, setEventsKeyboard] =
    useState<IStageEvents>("STAGE_WATCHING");

  const [elementsIds, setElementsIds] = useState<string[]>([]);

  const updateSelectionRect = useCallback(() => {
    if (selectionRectRef?.current) {
      const node = selectionRectRef.current;
      if (node) {
        node.setAttrs({
          visible: selection.current.visible,
          x: Math.min(selection.current.x1, selection.current.x2),
          y: Math.min(selection.current.y1, selection.current.y2),
          width: Math.abs(selection.current.x1 - selection.current.x2),
          height: Math.abs(selection.current.y1 - selection.current.y2),
          fill: "rgba(0, 161, 255, 0.3)",
        });
        node.getLayer().batchDraw();
      }
    }
  }, [selectionRectRef]);

  const handleMouseDown = useCallback(
    (eventStage: KonvaEventObject<MouseEvent>) => {
      if (eventsKeyboard === "STAGE_WATCHING") {
        const canSelectWithTheCursorElements =
          !isCreatingElement &&
          !drawing &&
          !elementSelected?.id &&
          !elementWithPipeline?.id &&
          !isThereMoreSelectedElements;

        // if (canSelectWithTheCursorElements) {
        //   const { x, y } = absolutePositionFromStage(eventStage);
        //   selection.current.visible = true;
        //   selection.current.x1 = Number(x);
        //   selection.current.y1 = Number(y);
        //   selection.current.x2 = Number(x);
        //   selection.current.y2 = Number(y);
        //   updateSelectionRect();
        // }
        if (isCreatingElement) {
          // setDraw(true);
          const elementTemplateStartEvent = eventElements?.[tool]?.start;

          const { x, y } = absolutePositionFromStage(eventStage);

          const elementCreated = elementTemplateStartEvent?.(
            { x, y },
            Object.keys(AllElements).length,
            page,
            ""
          );
          if (elementCreated) {
            handlePipelineSetElement(elementCreated);
          }
        }
      }

      if (eventsKeyboard === "STAGE_COPY_ELEMENT") {
        // if (elementSelected?.id && !isThereMoreSelectedElements) {
        //   const newElement: IPELMT = Object.assign({}, elementSelected, {
        //     id: v4(),
        //     groupId: "",
        //     view_position: Object.keys(AllElements).length + 1,
        //   } as IPELMT);
        //   handlePipelineSetElement(newElement);
        // }
        // if (isThereMoreSelectedElements) {
        //   for (let index = 0; index < elementsIds.length; index++) {
        //     const element = AllElements[elementsIds[index]];
        //     handleUpdateElement(
        //       Object.assign({}, element, {
        //         id: v4(),
        //         view_position: Object.keys(AllElements).length + index + 1,
        //       })
        //     );
        //   }
        // }
      }
    },
    [
      isCreatingElement,
      eventsKeyboard,
      handlePipelineSetElement,
      drawing,
      elementSelected,
      elementWithPipeline,
      isThereMoreSelectedElements,
      AllElements,
    ]
  );

  const handleMouseMove = useCallback(
    (eventStage: KonvaEventObject<MouseEvent>) => {
      const { x, y } = absolutePositionFromStage(eventStage);

      // if (!drawing) return;

      if (eventsKeyboard === "STAGE_WATCHING") {
        const canSelectWithTheCursorElements =
          !drawing && !elementWithPipeline?.id && !isThereMoreSelectedElements;

        // if (canSelectWithTheCursorElements) {
        //   if (!selection.current.visible) return;
        //   selection.current.x2 = Number(x);
        //   selection.current.y2 = Number(y);
        //   updateSelectionRect();
        // }
        if (elementWithPipeline.id) {
          const elementTemplateProgressEvent = eventElements?.[tool]?.progress;
          if (elementTemplateProgressEvent) {
            const updateElement = elementTemplateProgressEvent(
              { x, y },
              elementWithPipeline
            );
            handlePipelineSetElement(updateElement);
          }
        }
      }

      // if (eventsKeyboard === "STAGE_COPY_ELEMENT") {
      //   if (elementWithPipeline?.id) {
      //     const updateElement = Object.assign({}, elementSelected, {
      //       x,
      //       y,
      //     });
      //     handlePipelineSetElement(updateElement);
      //   }
      // }
    },
    [
      isCreatingElement,
      eventsKeyboard,
      drawing,
      elementSelected,
      elementWithPipeline,
      isThereMoreSelectedElements,
      AllElements,
    ]
  );

  const handleMouseUp = useCallback(() => {
    // if (selection.current.visible) {
    //   selection.current.visible = false;
    //   const { x1, x2, y1, y2 } = selection.current;
    //   const moved = x1 !== x2 || y1 !== y2;
    //   if (!moved) {
    //     updateSelectionRect();
    //     return;
    //   }
    //   updateSelectionRect();

    //   const selBox = selectionRectRef?.current?.getClientRect?.();

    //   const elementsLayer = layerRef?.current?.children;

    //   const elementsSel = elementsLayer?.filter?.((elementNode) => {
    //     if (
    //       elementNode?.attrs?.id === "select-rect-default" ||
    //       elementNode?.attrs?.id === "group-style-background" ||
    //       elementNode?.attrs?.isBlocked
    //     )
    //       return;
    //     const elBox = elementNode.getClientRect();
    //     if (Konva.Util.haveIntersection(selBox, elBox)) {
    //       return elementNode;
    //     }
    //   });

    //   setElementsIds(
    //     elementsSel?.map((item) => `${item?.attrs?.id}`) as string[]
    //   );

    //   setSelected(Boolean(Number(elementsSel?.length)));
    //   if (elementsSel?.length) {
    //     trRef.current.nodes(elementsSel);
    //   } else {
    //     trRef.current.nodes([]);
    //   }
    // }
    if (eventsKeyboard === "STAGE_COPY_ELEMENT") {
      setEventsKeyboard("STAGE_WATCHING");
    }
    if (drawing) {
      setDraw(false);
    }
    if (tool !== "MOVE") {
      setTool("MOVE");
    }

    if (elementWithPipeline?.id) {
      handleCreateElementInAllElements(elementWithPipeline);
      handleCleanSelectedElement();
      handleCleanPipelineSelectedElement();
    }
  }, [
    selection,
    layerRef,
    eventsKeyboard,
    drawing,
    tool,
    elementWithPipeline,
    elementSelected,
  ]);

  const handleResetElement = (kl: IKeyTool) => {
    setTool(kl);
    handleCleanSelectedElement();
    handleCleanPipelineSelectedElement();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();

      if (disableKeyBoard) {
        if (KEY === "DELETE") {
          if (!isThereMoreSelectedElements) {
            handleDeleteElement(`${elementSelected?.id}`);
            handleCleanSelectedElement();
          } else {
            handleDeleteManyElements(elementsIds);
            handleCleanSelectedElement();
            setSelected(false);
            trRef.current.nodes([]);
            setElementsIds([]);
          }
        }
        if (KEY === "ALT") {
          setEventsKeyboard("STAGE_COPY_ELEMENT");
        }
        if (KEY === "O") {
          handleResetElement("CIRCLE");
        }
        if (KEY === "L") {
          handleResetElement("LINE");
        }
        if (KEY === "V") {
          handleResetElement("MOVE");
        }
        if (KEY === "I") {
          handleResetElement("IMAGE");
        }
        if (KEY === "F") {
          handleResetElement("BOX");
        }
        if (KEY === "T") {
          handleResetElement("TEXT");
        }
      }
    };
    const handleKeyUp = () => {
      setEventsKeyboard("STAGE_WATCHING");
    };

    const handlePaste = (event: globalThis.ClipboardEvent) => {
      const clipboardText = event?.clipboardData?.getData("text") ?? "";

      const file = event?.clipboardData?.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (data) {
          const image = new Image();
          image.src = data?.target?.result as string;
          image.onload = () => {
            const createStartElement = eventElements?.["IMAGE"]
              ?.start as IStartEvent;
            const createdElement = createStartElement(
              {
                x: 0,
                y: 0,
              },
              Object.keys(AllElements).length,
              page,
              "",
              {
                image: data?.target?.result as string,
                width: image.width,
                height: image.height,
              }
            );
            handleCreateElementInAllElements(createdElement);
          };
        };
        reader.readAsDataURL(file);
      }

      if (clipboardText && !clipboardText.trim().startsWith("<svg")) {
        const createStartElement = eventElements?.["TEXT"]
          ?.start as IStartEvent;
        const createdElement = createStartElement(
          {
            x: 0,
            y: 0,
          },
          Object.keys(AllElements).length,
          page,
          "",
          {
            text: clipboardText,
          }
        );
        handleCreateElementInAllElements(createdElement);
      }

      if (clipboardText.trim().startsWith("<svg")) {
        const parser = new DOMParser();
        const svgDOM = parser
          .parseFromString(clipboardText, "image/svg+xml")
          .querySelector("svg");

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgDOM as SVGSVGElement);

        const img = new Image();

        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas?.getContext?.("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          ctx?.drawImage(img, 0, 0);
        };

        const dataImage =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

        img.src = dataImage;
        const createStartElement = eventElements?.["IMAGE"]
          ?.start as IStartEvent;
        const createdElement = createStartElement(
          {
            x: 0,
            y: 0,
          },
          Object.keys(AllElements).length,
          page,
          "",
          {
            image: dataImage,
            width: img.width,
            height: img.height,
          }
        );
        handleCreateElementInAllElements(createdElement);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [elementWithPipeline, disableKeyBoard, elementSelected, elementsIds]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTool("MOVE");
        setEventsKeyboard("STAGE_WATCHING");
      } else {
        setTool("MOVE");
        setEventsKeyboard("STAGE_WATCHING");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    stageDataRef,
  };
};

export default useEvent;
