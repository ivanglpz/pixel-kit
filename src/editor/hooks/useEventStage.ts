/* eslint-disable react-hooks/exhaustive-deps */
import { IShape } from "@/editor/shapes/type.shape";
import { showClipAtom } from "@/editor/states/clipImage";
import TOOL_ATOM, { IKeyMethods, IKeyTool } from "@/editor/states/tool";
import { useAtom, useSetAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect } from "react";
import stageAbsolutePosition from "../helpers/position";
import { shapeProgressEvent } from "../helpers/progressEvent";
import { shapeStart } from "../helpers/startEvent";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../states/currentItem";
import { EVENT_ATOM } from "../states/event";
import { SHAPE_ID_ATOM } from "../states/shape";
import { CREATE_SHAPE_ATOM, DELETE_SHAPE_ATOM } from "../states/shapes";
import { useConfiguration } from "./useConfiguration";
import { useStartDrawing } from "./useStartDrawing";

export type IShapeProgressEvent = {
  [key in IKeyMethods]: (x: number, y: number, element: IShape) => IShape;
};

const useEventStage = () => {
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const { state } = useStartDrawing();
  const [shapeId, setShapeId] = useAtom(SHAPE_ID_ATOM);
  const SET_CREATE_CITEM = useSetAtom(CREATE_CURRENT_ITEM_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const [CURRENT_ITEM, SET_UPDATE_CITEM] = useAtom(CURRENT_ITEM_ATOM);

  const { config } = useConfiguration();

  const setshowClip = useSetAtom(showClipAtom);

  const [eventStage, setEventStage] = useAtom(EVENT_ATOM);

  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    if (eventStage === "CREATE") {
      if (["BOX", "CIRCLE", "IMAGE", "TEXT", "GROUP"]?.includes(tool)) {
        setEventStage("CREATING");
        const { x, y } = stageAbsolutePosition(event);
        const createStartElement = shapeStart({
          tool,
          x,
          y,
          isWritingNow: false,
        });
        SET_CREATE_CITEM(createStartElement);
      }
      if (["LINE"]?.includes(tool)) {
        setEventStage("CREATING");

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
      }
      if (["DRAW"]?.includes(tool)) {
        setEventStage("CREATING");
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
    }
    if (eventStage === "COPY") {
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    if (!CURRENT_ITEM?.tool) return;

    if (eventStage === "CREATING") {
      const cshape = CURRENT_ITEM;
      if (["BOX", "CIRCLE", "IMAGE", "TEXT", "GROUP"]?.includes(cshape.tool)) {
        const { x, y } = stageAbsolutePosition(event);
        const updateProgressElement = shapeProgressEvent[CURRENT_ITEM.tool];

        const updateShape = updateProgressElement(x, y, CURRENT_ITEM);
        SET_UPDATE_CITEM(updateShape);
      }
      if (["LINE"]?.includes(cshape.tool)) {
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
      if (["DRAW"]?.includes(cshape.tool)) {
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
    }
  };

  const handleMouseUp = () => {
    if (!CURRENT_ITEM?.id) return;

    if (eventStage === "CREATING") {
      const cshape = CURRENT_ITEM;
      if (["BOX", "CIRCLE", "IMAGE", "TEXT", "GROUP"]?.includes(cshape.tool)) {
        const payload: IShape = {
          ...CURRENT_ITEM,
          isWritingNow: true,
          dashEnabled: false,
          shadowEnabled: false,
          strokeEnabled: false,
        };
        setShapeId(payload?.id);

        SET_CREATE(payload);
        SET_CLEAR_CITEM();
        setEventStage("IDLE");
        setTool("MOVE");
      }
      if (["LINE"]?.includes(cshape.tool)) {
        SET_CREATE(CURRENT_ITEM);
        SET_CLEAR_CITEM();
        setEventStage("CREATE");
        setTool("LINE");
      }
      if (["DRAW"]?.includes(cshape.tool)) {
        SET_CREATE({
          ...CURRENT_ITEM,
          bezier: true,
        });
        SET_CLEAR_CITEM();
        setEventStage("CREATE");
        setTool("DRAW");
      }
    }
  };
  const toolKeydown = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
    setShapeId(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();

      if (tool !== "WRITING") {
        if (["X", "DELETE", "BACKSPACE"].includes(KEY)) {
          if (shapeId) {
            DELETE_SHAPE({ id: shapeId });
            setShapeId(null);
          }
        }
        if (KEY === "ALT") {
          setEventStage("COPY");
        }

        const keysActions = Object.fromEntries(
          config.tools.map((item) => [
            item.keyBoard,
            { keyMethod: item.keyMethod, eventStage: item.eventStage },
          ])
        );

        if (keysActions[KEY]) {
          setshowClip(false);
          toolKeydown(keysActions[KEY].keyMethod);
          setEventStage(keysActions[KEY].eventStage);
        }
      }
    };
    const handleKeyUp = () => {
      // setEventStage("IDLE");
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
  }, [tool, shapeId]);

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
