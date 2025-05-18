/* eslint-disable react-hooks/exhaustive-deps */
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useState } from "react";
import useTool from "./useTool";
import { shapeProgressEvent } from "../helpers/progressEvent";
import { shapeStart } from "../helpers/startEvent";
import stageAbsolutePosition from "../helpers/position";
import { useSetAtom } from "jotai";
import useSelectedShape from "./useSelectedShape";
import useShapes from "./useShapes";
import useCurrentItem from "./useCurrentItem";
import { IKeyMethods, IKeyTool } from "@/editor/states/tool";
import { useStartDrawing } from "./useStartDrawing";
import { showClipAtom } from "@/editor/states/clipImage";

import { IShape } from "@/editor/shapes/type.shape";

export type IRelativePosition = {
  x: number;
  y: number;
};

export type IStartEvent = (
  event: IRelativePosition,
  params?: {
    text?: string;
    image?: string;
    width?: number;
    height?: number;
  }
) => IShape;

export type IEndEvent = (event: IRelativePosition, element: IShape) => IShape;

export type IEventElement = {
  [key in IKeyTool]?: {
    start: IStartEvent;
    progress: IEndEvent;
  };
};

export type IShapeProgressEvent = {
  [key in IKeyMethods]: (x: number, y: number, element: IShape) => IShape;
};

export type IStageEvents =
  | "STAGE_COPY_IMAGE_SHAPE"
  | "STAGE_IDLE"
  | "STAGE_TEMPORAL_CREATING_SHAPE"
  | "STAGE_TEMPORAL_UPDATING_SHAPE"
  | "STAGE_COPY_TEXT_SHAPE"
  | "STAGE_COPY_SHAPE_SVG"
  | "STAGE_DELETE_SHAPES"
  | "STAGE_COPY_SHAPE"
  | "STAGE_IS_DRAWING_NOW"
  | "STAGE_CREATING_LINE";

const useEventStage = () => {
  const { isGoingToCreateAShape, tool, setTool, isNotWriting, isDrawing } =
    useTool();
  const { handleCreateShape, handleDeleteShapeInShapes } = useShapes();

  const { shapeSelected, handleCleanShapeSelected, handleSetShapeSelected } =
    useSelectedShape();
  const { state } = useStartDrawing();
  const {
    handleCleanTemporalShape,
    handleCreateTemporalShape,
    handleUpdateTemporalShape,
    temporalShape,
  } = useCurrentItem();
  const setshowClip = useSetAtom(showClipAtom);

  const [eventStage, setEventStage] = useState<IStageEvents>("STAGE_IDLE");

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (tool === "LINE") {
      setEventStage("STAGE_CREATING_LINE");
      const { x, y } = stageAbsolutePosition(event);
      const createStartElement = shapeStart({
        tool,
        x: 0,
        y: 0,
        ...state,
        strokeWidth: state.thickness,
        stroke: state.color,
        points: [x, y],
        isWritingNow: false,
      });

      handleCreateTemporalShape(createStartElement);
    }
    if (isGoingToCreateAShape && tool !== "LINE") {
      setEventStage("STAGE_TEMPORAL_CREATING_SHAPE");
      const { x, y } = stageAbsolutePosition(event);
      const createStartElement = shapeStart({
        tool,
        x,
        y,
        isWritingNow: false,
      });

      handleCreateTemporalShape(createStartElement);
    }
    if (isDrawing) {
      setEventStage("STAGE_IS_DRAWING_NOW");
      const { x: XStage, y: YStage } = stageAbsolutePosition(event);
      const x = XStage ?? 0;
      const y = YStage ?? 0;
      const createStartElement = shapeStart({
        tool,
        x: 0,
        y: 0,
        ...state,
        strokeWidth: state.thickness,
        stroke: state.color,
        points: [x, y, x, y],
        bezier: false,
      });

      handleCreateTemporalShape(createStartElement);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (eventStage === "STAGE_TEMPORAL_CREATING_SHAPE" && temporalShape?.tool) {
      const { x, y } = stageAbsolutePosition(event);
      const updateProgressElement = shapeProgressEvent[temporalShape.tool];

      const updateShape = updateProgressElement(x, y, temporalShape);
      handleUpdateTemporalShape(updateShape);
    }

    if (eventStage === "STAGE_IS_DRAWING_NOW" && temporalShape?.tool) {
      const updateProgressElement = shapeProgressEvent[temporalShape.tool];
      const { x: XStage, y: YStage } = stageAbsolutePosition(event);
      const x = XStage ?? 0;
      const y = YStage ?? 0;
      const updateShape = updateProgressElement(x, y, {
        ...temporalShape,
        points: temporalShape.points?.concat([x, y]),
      });
      handleUpdateTemporalShape(updateShape);
    }
    if (eventStage === "STAGE_CREATING_LINE" && temporalShape?.tool) {
      const { x, y } = stageAbsolutePosition(event);
      const updateProgressElement = shapeProgressEvent[temporalShape.tool];

      const updateShape = updateProgressElement(x, y, {
        ...temporalShape,
        points: [
          temporalShape?.points?.[0] ?? 0,
          temporalShape?.points?.[1] ?? 0,
          x,
          y,
        ],
      });

      handleUpdateTemporalShape(updateShape);
    }
  };

  const handleMouseUp = () => {
    //create new shape in shapes and clean temporal shape and set tool with eventstage
    if (eventStage === "STAGE_TEMPORAL_CREATING_SHAPE" && temporalShape?.id) {
      const payload: IShape = {
        ...temporalShape,
        isWritingNow: true,
        dashEnabled: false,
        shadowEnabled: false,
        strokeEnabled: false,
      };
      handleSetShapeSelected(payload);
      handleCreateShape(payload);
      handleCleanTemporalShape();
      setEventStage("STAGE_IDLE");
      setTool("MOVE");
    }
    if (eventStage === "STAGE_IS_DRAWING_NOW" && temporalShape?.id) {
      handleCreateShape({
        ...temporalShape,
        bezier: true,
      });
      handleCleanTemporalShape();
    }
    if (eventStage === "STAGE_CREATING_LINE" && temporalShape?.id) {
      handleCreateShape(temporalShape);
      handleCleanTemporalShape();
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
          setshowClip(false);
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

export default useEventStage;
