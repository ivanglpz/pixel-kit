/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import useSelectedShape from "../selectedShape/hook";
import useShapes from "../shapes/hook";
import usePages from "../pages/hook";
import useTemporalShape from "../temporalShape/hook";
import useTool from "../tool/hook";
import { IStageEvents } from "./types";
import { shapeProgressEvent } from "./progress";
import { shapeStart } from "./start";
import { IKeyMethods, IKeyTool } from "../tool/types";
import stageAbsolutePosition from "../../helpers/position";

const useEvent = () => {
  const { isGoingToCreateAShape, tool, setTool, isNotWriting } = useTool();
  const { handleCreateShape, handleDeleteShapeInShapes } = useShapes();

  const { shapeSelected, handleCleanShapeSelected, handleSetShapeSelected } =
    useSelectedShape();

  const {
    handleCleanTemporalShape,
    handleCreateTemporalShape,
    handleUpdateTemporalShape,
    temporalShape,
  } = useTemporalShape();

  const { page } = usePages();

  const [eventStage, setEventStage] = useState<IStageEvents>("STAGE_IDLE");

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (isGoingToCreateAShape) {
      setEventStage("STAGE_TEMPORAL_CREATING_SHAPE");
      const { x, y } = stageAbsolutePosition(event);
      const createStartElement = shapeStart({
        count: 1,
        pageId: page,
        tool,
        x,
        y,
      });

      handleCreateTemporalShape(createStartElement);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    ///updating temporal shape in stage
    if (eventStage === "STAGE_TEMPORAL_CREATING_SHAPE" && temporalShape?.tool) {
      const updateProgressElement = shapeProgressEvent[temporalShape.tool];

      const { x, y } = stageAbsolutePosition(event);
      const updateShape = updateProgressElement(x, y, temporalShape);
      handleUpdateTemporalShape(updateShape);
    }
  };

  const handleMouseUp = () => {
    //create new shape in shapes and clean temporal shape and set tool with eventstage
    if (eventStage === "STAGE_TEMPORAL_CREATING_SHAPE" && temporalShape?.id) {
      handleCreateShape(temporalShape);
      handleSetShapeSelected(temporalShape);
      handleCleanTemporalShape();
      setEventStage("STAGE_IDLE");
      setTool("MOVE");
    }
  };
  const handleResetElement = (kl: IKeyTool) => {
    setTool(kl);
    handleCleanTemporalShape();
    handleCleanShapeSelected();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();

      if (isNotWriting) {
        if (KEY === "DELETE") {
          if (shapeSelected?.id) {
            handleDeleteShapeInShapes(`${shapeSelected?.id}`);
            handleCleanShapeSelected();
          }
        }
        if (KEY === "ALT") {
          setEventStage("STAGE_COPY_SHAPE");
        }
        const keysActions: { [key in string]: IKeyTool } = {
          O: "CIRCLE",
          L: "LINE",
          V: "MOVE",
          I: "IMAGE",
          F: "BOX",
          T: "TEXT",
        };
        if (keysActions[KEY]) {
          handleResetElement(keysActions[KEY] as IKeyMethods);
        }
      }
    };
    const handleKeyUp = () => {
      setEventStage("STAGE_IDLE");
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
            if (typeof data?.target?.result !== "string") return;
            const createStartElement = shapeStart({
              count: 1,
              pageId: page,
              tool: "IMAGE",
              x: 0,
              y: 0,
              image: data?.target?.result,
              width: image.width,
              height: image.height,
            });

            handleCreateShape(createStartElement);
          };
        };
        reader.readAsDataURL(file);
      }

      if (clipboardText && !clipboardText.trim().startsWith("<svg")) {
        const createStartElement = shapeStart({
          count: 1,
          pageId: page,
          tool: "TEXT",
          x: 0,
          y: 0,
          text: clipboardText,
        });

        handleCreateShape(createStartElement);
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
          const createStartElement = shapeStart({
            count: 1,
            pageId: page,
            tool: "IMAGE",
            x: 0,
            y: 0,
            image: canvas?.toDataURL(),
            width: img.width,
            height: img.height,
          });

          handleCreateShape(createStartElement);
        };

        const dataImage =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);

        img.src = dataImage;
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
  }, [isNotWriting, shapeSelected]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setTool("MOVE");
      setEventStage("STAGE_IDLE");
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
  };
};

export default useEvent;
