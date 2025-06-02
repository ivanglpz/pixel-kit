/* eslint-disable react-hooks/exhaustive-deps */
import { IShape } from "@/editor/shapes/type.shape";
import { showClipAtom } from "@/editor/states/clipImage";
import { IKeyMethods, IKeyTool } from "@/editor/states/tool";
import { useAtom, useSetAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useState } from "react";
import stageAbsolutePosition from "../helpers/position";
import { shapeProgressEvent } from "../helpers/progressEvent";
import { shapeStart } from "../helpers/startEvent";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../states/currentItem";
import { CREATE_SHAPE_ATOM, DELETE_SHAPE_ATOM } from "../states/shapes";
import { useConfiguration } from "./useConfiguration";
import useSelectedShape from "./useSelectedShape";
import { useStartDrawing } from "./useStartDrawing";
import useTool from "./useTool";

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
  | "COPY_IMAGE_SHAPE"
  | "IDLE"
  | "CREATING_SHAPE"
  | "UPDATING_SHAPE"
  | "COPY_TEXT_SHAPE"
  | "COPY_SHAPE_SVG"
  | "DELETE_SHAPES"
  | "COPY_SHAPE"
  | "IS_DRAWING_NOW"
  | "CREATING_LINE";

const useEventStage = () => {
  const { isGoingToCreateAShape, tool, setTool, isNotWriting, isDrawing } =
    useTool();

  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const { shapeSelected, handleCleanShapeSelected, handleSetShapeSelected } =
    useSelectedShape();
  const { state } = useStartDrawing();

  const SET_CREATE_CITEM = useSetAtom(CREATE_CURRENT_ITEM_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const [CURRENT_ITEM, SET_UPDATE_CITEM] = useAtom(CURRENT_ITEM_ATOM);

  const { config } = useConfiguration();

  const setshowClip = useSetAtom(showClipAtom);

  const [eventStage, setEventStage] = useState<IStageEvents>("IDLE");

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (tool === "LINE") {
      setEventStage("CREATING_LINE");
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

      SET_CREATE_CITEM(createStartElement);
      return;
    }

    if (isGoingToCreateAShape) {
      setEventStage("CREATING_SHAPE");
      const { x, y } = stageAbsolutePosition(event);
      const createStartElement = shapeStart({
        tool,
        x,
        y,
        isWritingNow: false,
      });

      SET_CREATE_CITEM(createStartElement);
    }
    if (isDrawing) {
      setEventStage("IS_DRAWING_NOW");
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

      SET_CREATE_CITEM(createStartElement);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (!CURRENT_ITEM?.tool) return;

    if (eventStage === "CREATING_SHAPE") {
      const { x, y } = stageAbsolutePosition(event);
      const updateProgressElement = shapeProgressEvent[CURRENT_ITEM.tool];

      const updateShape = updateProgressElement(x, y, CURRENT_ITEM);
      SET_UPDATE_CITEM(updateShape);
    }

    if (eventStage === "IS_DRAWING_NOW") {
      const updateProgressElement = shapeProgressEvent[CURRENT_ITEM.tool];
      const { x: XStage, y: YStage } = stageAbsolutePosition(event);
      const x = XStage ?? 0;
      const y = YStage ?? 0;
      const updateShape = updateProgressElement(x, y, {
        ...CURRENT_ITEM,
        points: CURRENT_ITEM.points?.concat([x, y]),
      });
      SET_UPDATE_CITEM(updateShape);
    }
    if (eventStage === "CREATING_LINE") {
      const { x, y } = stageAbsolutePosition(event);
      const updateProgressElement = shapeProgressEvent[CURRENT_ITEM.tool];

      const updateShape = updateProgressElement(x, y, {
        ...CURRENT_ITEM,
        points: [
          CURRENT_ITEM?.points?.[0] ?? 0,
          CURRENT_ITEM?.points?.[1] ?? 0,
          x,
          y,
        ],
      });

      SET_UPDATE_CITEM(updateShape);
    }
  };

  const handleMouseUp = () => {
    if (!CURRENT_ITEM?.id) return;

    if (eventStage === "CREATING_SHAPE") {
      const payload: IShape = {
        ...CURRENT_ITEM,
        isWritingNow: true,
        dashEnabled: false,
        shadowEnabled: false,
        strokeEnabled: false,
      };
      handleSetShapeSelected(payload);
      SET_CREATE(payload);
      SET_CLEAR_CITEM();
      setEventStage("IDLE");
      setTool("MOVE");
    }
    if (eventStage === "IS_DRAWING_NOW") {
      SET_CREATE({
        ...CURRENT_ITEM,
        bezier: true,
      });
      SET_CLEAR_CITEM();
    }

    if (eventStage === "CREATING_LINE") {
      SET_CREATE(CURRENT_ITEM);
      SET_CLEAR_CITEM();
    }
  };
  const handleResetElement = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
    handleCleanShapeSelected();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();

      if (isNotWriting) {
        if (["X", "DELETE", "BACKSPACE"].includes(KEY)) {
          if (shapeSelected?.id) {
            DELETE_SHAPE({ id: shapeSelected?.id });
            handleCleanShapeSelected();
          }
        }
        if (KEY === "ALT") {
          setEventStage("COPY_SHAPE");
        }

        const keysActions = Object.fromEntries(
          config.tools.map((item) => [item.keyBoard, item.keyMethod])
        );

        if (keysActions[KEY]) {
          setshowClip(false);
          handleResetElement(keysActions[KEY] as IKeyMethods);
        }
      }
    };
    const handleKeyUp = () => {
      setEventStage("IDLE");
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

            SET_CREATE(createStartElement);
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

        SET_CREATE(createStartElement);
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

          SET_CREATE(createStartElement);
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
      setEventStage("IDLE");
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
