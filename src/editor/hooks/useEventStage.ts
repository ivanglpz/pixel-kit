/* eslint-disable react-hooks/exhaustive-deps */
import { IShape } from "@/editor/shapes/type.shape";
import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import TOOL_ATOM, { IKeyTool, PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import stageAbsolutePosition from "../helpers/position";
import { shapeProgressEvent } from "../helpers/progressEvent";
import { cloneDeep, shapeStart } from "../helpers/startEvent";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../states/currentItem";
import { DRAW_START_CONFIG_ATOM } from "../states/drawing";
import { EVENT_ATOM } from "../states/event";
import {
  ADD_SHAPE_ID_ATOM,
  GET_SELECTED_SHAPES_ATOM,
  REMOVE_SHAPE_ID_ATOM,
  RESET_SHAPES_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "../states/shape";
import { CREATE_SHAPE_ATOM, DELETE_SHAPE_ATOM } from "../states/shapes";
import { useConfiguration } from "./useConfiguration";

// ===== CONSTANTS =====
const TOOLS_BOX_BASED = ["BOX", "CIRCLE", "IMAGE", "TEXT", "GROUP"];
const TOOLS_DRAW_BASED = ["DRAW"];
const TOOLS_LINE_BASED = ["LINE"];
const DELETE_KEYS = ["X", "DELETE", "BACKSPACE"];

const useEventStage = () => {
  // ===== STATE HOOKS =====
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const [shapeId, setShapeId] = useAtom(ADD_SHAPE_ID_ATOM);
  const [CURRENT_ITEM, SET_UPDATE_CITEM] = useAtom(CURRENT_ITEM_ATOM);
  const [EVENT_STAGE, SET_EVENT_STAGE] = useAtom(EVENT_ATOM);

  // ===== READ-ONLY STATE =====
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);
  const drawConfig = useAtomValue(DRAW_START_CONFIG_ATOM);
  const selectedShapes = useAtomValue(GET_SELECTED_SHAPES_ATOM);
  const { config } = useConfiguration();

  // ===== SETTERS =====
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const removeShapeId = useSetAtom(REMOVE_SHAPE_ID_ATOM);
  const SET_UPDATE_SHAPES_IDS = useSetAtom(UPDATE_SHAPES_IDS_ATOM);
  const SET_CREATE_CITEM = useSetAtom(CREATE_CURRENT_ITEM_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
  const setshowClip = useSetAtom(SHOW_CLIP_ATOM);

  // ===== MOUSE EVENT HANDLERS =====
  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    const { x, y } = stageAbsolutePosition(event);

    if (EVENT_STAGE === "CREATE") {
      handleCreateMode(x, y);
    } else if (EVENT_STAGE === "COPY") {
      handleCopyMode(x, y);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    const { x, y } = stageAbsolutePosition(event);

    if (EVENT_STAGE === "CREATING") {
      handleCreatingMode(x, y);
    } else if (EVENT_STAGE === "COPYING") {
      handleCopyingMode(x, y);
    }
  };

  const handleMouseUp = () => {
    const payloads = CURRENT_ITEM?.map((e) => ({ ...e, isCreating: false }));

    if (EVENT_STAGE === "CREATING") {
      handleCreatingComplete(payloads);
    } else if (EVENT_STAGE === "COPYING") {
      handleCopyingComplete();
    }
  };

  // ===== CREATE MODE HANDLERS =====
  const handleCreateMode = (x: number, y: number) => {
    SET_EVENT_STAGE("CREATING");

    if (TOOLS_BOX_BASED.includes(tool)) {
      const createStartElement = shapeStart({
        tool: tool as IShape["tool"],
        x,
        y,
      });
      SET_CREATE_CITEM([createStartElement]);
    } else if (TOOLS_LINE_BASED.includes(tool)) {
      const createStartElement = shapeStart({
        ...drawConfig,
        tool: tool as IShape["tool"],
        x: 0,
        y: 0,
        points: [x, y],
        id: uuidv4(),
      });
      SET_CREATE_CITEM([createStartElement]);
    } else if (TOOLS_DRAW_BASED.includes(tool)) {
      const createStartElement = shapeStart({
        ...drawConfig,
        tool: tool as IShape["tool"],
        x: 0,
        y: 0,
        points: [x, y, x, y],
        id: uuidv4(),
      });
      SET_CREATE_CITEM([createStartElement]);
    }
  };

  const handleCopyMode = (x: number, y: number) => {
    const selected = selectedShapes();
    const newShapes = selected?.map((e) => {
      return cloneDeep({
        ...e,
        id: uuidv4(),
      });
    });

    resetShapesIds();
    SET_CREATE_CITEM(newShapes);
    SET_EVENT_STAGE("COPYING");
  };

  // ===== CREATING MODE HANDLERS =====
  const handleCreatingMode = (x: number, y: number) => {
    const newShape = CURRENT_ITEM.at(0);
    if (!newShape) return;

    const updateProgressElement = shapeProgressEvent[newShape.tool];

    if (TOOLS_BOX_BASED.includes(newShape.tool)) {
      const updateShape = updateProgressElement(x, y, newShape);
      SET_UPDATE_CITEM([updateShape]);
    } else if (TOOLS_LINE_BASED.includes(newShape.tool)) {
      const updateShape = updateProgressElement(x, y, {
        ...newShape,
        points: [newShape?.points?.[0] ?? 0, newShape?.points?.[1] ?? 0, x, y],
      });
      SET_UPDATE_CITEM([updateShape]);
    } else if (TOOLS_DRAW_BASED.includes(newShape.tool)) {
      const updateShape = updateProgressElement(x, y, {
        ...newShape,
        points: newShape.points?.concat([x, y]),
      });
      SET_UPDATE_CITEM([updateShape]);
    }
  };

  const handleCopyingMode = (x: number, y: number) => {
    const newShapes = CURRENT_ITEM?.map((e) => ({
      ...e,
      x,
      y,
    }));
    SET_UPDATE_CITEM(newShapes);
  };

  // ===== COMPLETION HANDLERS =====
  const handleCreatingComplete = (payloads: typeof CURRENT_ITEM) => {
    const newShape = payloads.at(0);
    if (!newShape) return;

    if (TOOLS_BOX_BASED.includes(newShape.tool)) {
      SET_CREATE({
        ...newShape,
        x: newShape.x + newShape.width / 2,
        y: newShape.y + newShape.height / 2,
      });
      SET_CLEAR_CITEM();
      SET_EVENT_STAGE("IDLE");
      setTool("MOVE");
      setTimeout(() => setShapeId(newShape?.id), 1);
    } else if (TOOLS_LINE_BASED.includes(newShape.tool)) {
      SET_CREATE(newShape);
      SET_CLEAR_CITEM();
      SET_EVENT_STAGE("CREATE");
      setTool("LINE");
    } else if (TOOLS_DRAW_BASED.includes(newShape.tool)) {
      SET_CREATE(newShape);
      SET_CLEAR_CITEM();
      SET_EVENT_STAGE("CREATE");
      setTool("DRAW");
    }
  };

  const handleCopyingComplete = () => {
    for (const element of CURRENT_ITEM) {
      SET_CREATE(element);
    }
    SET_UPDATE_SHAPES_IDS(CURRENT_ITEM?.map((e) => e?.id));
    SET_CLEAR_CITEM();
    SET_EVENT_STAGE("IDLE");
    setTool("MOVE");
  };

  // ===== UTILITY FUNCTIONS =====
  const toolKeydown = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
    resetShapesIds();
  };

  const handleDeleteShapes = () => {
    for (const element of shapeId) {
      DELETE_SHAPE({ id: element });
      removeShapeId(element);
    }
  };

  const createImageFromFile = (file: File, dataUrl: string) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      const createStartElement = shapeStart({
        tool: "IMAGE",
        x: 0,
        y: 0,
        width: image.width / 3,
        height: image.height / 3,
        fills: [
          {
            color: "#fff",
            id: uuidv4(),
            image: {
              src: dataUrl,
              width: image.width,
              height: image.height,
              name: file.name,
            },
            opacity: 1,
            type: "image",
            visible: true,
          },
        ],
      });
      SET_CREATE(createStartElement);
    };
  };

  const createTextFromClipboard = (text: string) => {
    const createStartElement = shapeStart({
      tool: "TEXT",
      x: 0,
      y: 0,
      text,
    });
    SET_CREATE(createStartElement);
  };

  const createImageFromSVG = (svgString: string) => {
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
        fills: [
          {
            color: "#fff",
            id: uuidv4(),
            image: {
              src:
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(svgString),
              width: img.width,
              height: img.height,
              name: `svg ${uuidv4().slice(0, 2)}`,
            },
            opacity: 1,
            type: "image",
            visible: true,
          },
        ],
      });
      SET_CREATE(createStartElement);
    };

    const dataImage =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    img.src = dataImage;
  };

  // ===== EVENT LISTENERS =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();
      if (PAUSE) return;

      // Handle delete operations
      if (DELETE_KEYS.includes(KEY)) {
        handleDeleteShapes();
      }

      // Handle Alt key for copy mode
      if (KEY === "ALT") {
        SET_EVENT_STAGE("COPY");
      }

      // Handle tool shortcuts
      const keysActions = Object.fromEntries(
        config.tools.map((item) => [
          item.keyBoard,
          {
            keyMethod: item.keyMethod,
            eventStage: item.eventStage,
            showClip: Boolean(item?.showClip),
          },
        ])
      );

      if (keysActions[KEY]) {
        setshowClip(Boolean(keysActions[KEY].showClip));
        toolKeydown(keysActions[KEY].keyMethod);
        SET_EVENT_STAGE(keysActions[KEY].eventStage);
      }
    };

    const handlePaste = (event: globalThis.ClipboardEvent) => {
      const clipboardText = event?.clipboardData?.getData("text");
      const file = event?.clipboardData?.files[0];

      // Handle file paste (images)
      if (file) {
        const reader = new FileReader();
        reader.onload = function (data) {
          if (typeof data?.target?.result === "string") {
            createImageFromFile(file, data.target.result);
          }
        };
        reader.readAsDataURL(file);
        return;
      }

      // Handle SVG paste
      if (clipboardText && clipboardText.trim().startsWith("<svg")) {
        const parser = new DOMParser();
        const svgDOM = parser
          .parseFromString(clipboardText, "image/svg+xml")
          .querySelector("svg");

        if (svgDOM) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgDOM);
          createImageFromSVG(svgString);
        }
        return;
      }

      // Handle text paste
      if (
        clipboardText &&
        !clipboardText.trim().startsWith("<svg") &&
        shapeId?.length === 0
      ) {
        createTextFromClipboard(clipboardText);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [tool, shapeId, config.tools, PAUSE]);

  // ===== KEYBOARD STATE HANDLERS =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Alt") {
        SET_EVENT_STAGE("COPY");
      }
      if (event.key === "Shift") {
        SET_EVENT_STAGE("MULTI_SELECT");
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === "Shift") {
        SET_EVENT_STAGE("IDLE");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // ===== VISIBILITY CHANGE HANDLER =====
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTool("MOVE");
      SET_EVENT_STAGE("IDLE");
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
