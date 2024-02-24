/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { IPELMT } from "../../elements/type";
import absolutePositionFromStage from "../../helpers/stage/position";
import useSelectedShape from "../element/hook";
import useShapes from "../elements/hook";
import usePages from "../pages/hook";
import useTemporalShape from "../pipe/hook";
import useSelection from "../selection/hook";
import useTool from "../tool/hook";
import { IKeyTool } from "../tool/types";
import eventElements from "./event";
import { IStageEvents, IStartEvent } from "./types";

const useEvent = () => {
  const { isCreatingElement, tool, setTool, disableKeyBoard } = useTool();
  const {
    elements: AllElements,
    handleSetElements: handleCreateElementInAllElements,
    handleDeleteElement: handleDeleteElement,
    handleDeleteManyElements,
  } = useShapes();

  const {
    element: elementSelected,
    handleSetElement: handleSelectElement,
    handleEmptyElement: handleCleanSelectedElement,
  } = useSelectedShape();
  const {
    handleCleanTemporalShape,
    handleCreateTemporalShape,
    handleUpdateTemporalShape,
    temporalShape,
  } = useTemporalShape();

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

  const handleMouseDown = (eventStage: KonvaEventObject<MouseEvent>) => {};

  const handleMouseMove = (eventStage: KonvaEventObject<MouseEvent>) => {};

  const handleMouseUp = () => {};
  const handleResetElement = (kl: IKeyTool) => {
    // setTool(kl);
    // handleCleanSelectedElement();
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
            // handleDeleteManyElements(elementsIds);
            handleCleanSelectedElement();
            setSelected(false);
            trRef.current.nodes([]);
            // setElementsIds([]);
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
  }, [disableKeyBoard, elementSelected]);

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
