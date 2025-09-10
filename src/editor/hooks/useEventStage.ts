/* eslint-disable react-hooks/exhaustive-deps */
import { IShape } from "@/editor/shapes/type.shape";
import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import TOOL_ATOM, { IKeyTool, PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  CreateShapeSchema,
  UpdateShapeDimension,
} from "../helpers/shape-schema";
import CURRENT_ITEM_ATOM, {
  CLEAR_CURRENT_ITEM_ATOM,
  CREATE_CURRENT_ITEM_ATOM,
} from "../states/currentItem";
import { DRAW_START_CONFIG_ATOM } from "../states/drawing";
import { EVENT_ATOM } from "../states/event";
import { RECTANGLE_SELECTION_ATOM } from "../states/rectangle-selection";
import {
  GET_SELECTED_SHAPES_ATOM,
  SHAPE_IDS_ATOM,
  UPDATE_SHAPES_IDS_ATOM,
} from "../states/shape";
import { CREATE_SHAPE_ATOM, DELETE_SHAPES_ATOM } from "../states/shapes";
import { REDO_ATOM, UNDO_ATOM } from "../states/undo-redo";
import { capitalize } from "../utils/capitalize";
import { useConfiguration } from "./useConfiguration";

// ===== CONSTANTS =====
const TOOLS_BOX_BASED = ["BOX", "CIRCLE", "IMAGE", "TEXT", "GROUP"];
const TOOLS_DRAW_BASED = ["DRAW"];
const TOOLS_LINE_BASED = ["LINE"];
const DELETE_KEYS = ["DELETE", "BACKSPACE"];

export const useEventStage = () => {
  // ===== STATE HOOKS =====
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const [shapeId, setShapeId] = useAtom(SHAPE_IDS_ATOM);
  const [CURRENT_ITEM, SET_UPDATE_CITEM] = useAtom(CURRENT_ITEM_ATOM);
  const [EVENT_STAGE, SET_EVENT_STAGE] = useAtom(EVENT_ATOM);
  console.log(EVENT_STAGE, "EVENT_STAGE");

  console.log(CURRENT_ITEM, "CURRENT_ITEM");

  // ===== READ-ONLY STATE =====
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);

  const drawConfig = useAtomValue(DRAW_START_CONFIG_ATOM);
  const selectedShapes = useSetAtom(GET_SELECTED_SHAPES_ATOM);
  const { config } = useConfiguration();

  // ===== SETTERS =====
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPES_ATOM);
  const SET_UPDATE_SHAPES_IDS = useSetAtom(UPDATE_SHAPES_IDS_ATOM);
  const SET_CREATE_CITEM = useSetAtom(CREATE_CURRENT_ITEM_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const setshowClip = useSetAtom(SHOW_CLIP_ATOM);
  const [selection, setSelection] = useAtom(RECTANGLE_SELECTION_ATOM);
  const setRedo = useSetAtom(REDO_ATOM);
  const setUndo = useSetAtom(UNDO_ATOM);

  // ===== MOUSE EVENT HANDLERS =====
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("DISPARANDO MOUSE DOWN");

    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // if (
    //   EVENT_STAGE === "IDLE" &&
    //   [null, undefined, "main-image-render-stage", "pixel-kit-stage"].includes(
    //     event.target?.attrs?.id
    //   ) &&
    //   tool === "MOVE" &&
    //   shapeId?.length === 0
    // ) {
    //   setSelection({
    //     x,
    //     y,
    //     width: 0,
    //     height: 0,
    //     visible: true,
    //   });
    // }
    if (EVENT_STAGE === "CREATE") {
      handleCreateMode(x, y);
    }
    if (EVENT_STAGE === "COPY") {
      selectedShapes();
      SET_EVENT_STAGE("COPYING");
      setTool("MOVE");
    }

    console.log("mouse down");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    // if (
    //   selection.visible &&
    //   EVENT_STAGE === "IDLE" &&
    //   tool === "MOVE" &&
    //   shapeId?.length === 0
    // ) {
    //   setSelection({
    //     x: Math.min(selection.x, currentX),
    //     y: Math.min(selection.y, currentY),
    //     width: Math.abs(currentX - selection.x),
    //     height: Math.abs(currentY - selection.y),
    //     visible: true,
    //   });
    // }
    if (EVENT_STAGE === "CREATING") {
      handleCreatingMode(currentX, currentY);
    }
    if (EVENT_STAGE === "COPYING") {
      const items = CURRENT_ITEM?.map((i) => {
        return {
          ...i,
          x: currentX,
          y: currentY,
        };
      });
      SET_UPDATE_CITEM(items);
    }
    console.log("mouse move");
  };

  const handleMouseUp = async () => {
    console.log("mouse up");

    // if (selection.visible && EVENT_STAGE === "IDLE" && tool === "MOVE") {
    //   const childrens = Stage?.current?.getStage?.()?.children;

    //   if (!childrens) return;
    // const layer = childrens?.find((e) => e?.attrs?.id === "layer-shapes");
    // const nodes = layer?.children?.filter?.(
    //   (child) =>
    //     child?.attrs?.id !== "transformer-editable" && child?.attrs?.listening
    // );
    // if (!nodes) return;
    // const selected = nodes.filter((shape) =>
    // );

    // setTimeout(() => {
    //   SET_UPDATE_SHAPES_IDS(
    //     selected
    //       ?.map((e) => ({
    //         id: e?.attrs?.id,
    //         parentId: e?.attrs?.parentId,
    //       }))
    //       ?.filter((e) => typeof e?.id === "string")
    //   );
    //   setSelection({
    //     x: 0,
    //     y: 0,
    //     width: 0,
    //     height: 0,
    //     visible: false,
    //   });
    // }, 10);
    // }

    if (EVENT_STAGE === "CREATING") {
      handleCreatingComplete(CURRENT_ITEM);
    }
    if (EVENT_STAGE === "COPYING") {
      handleCreatingComplete(CURRENT_ITEM);
    }
  };

  // ===== CREATE MODE HANDLERS =====
  const handleCreateMode = (x: number, y: number) => {
    SET_EVENT_STAGE("CREATING");

    if (TOOLS_BOX_BASED.includes(tool)) {
      const createStartElement = CreateShapeSchema({
        tool: tool as IShape["tool"],
        x,
        y,
        id: uuidv4(),
        label: capitalize(tool),
      });
      SET_CREATE_CITEM([createStartElement]);
    }
    if (TOOLS_LINE_BASED.includes(tool)) {
      const createStartElement = CreateShapeSchema({
        ...drawConfig,
        tool: tool as IShape["tool"],
        x: 0,
        y: 0,
        points: [x, y],
        id: uuidv4(),
        label: capitalize(tool),
      });
      SET_CREATE_CITEM([createStartElement]);
    }
    if (TOOLS_DRAW_BASED.includes(tool)) {
      const createStartElement = CreateShapeSchema({
        ...drawConfig,
        tool: tool as IShape["tool"],
        x: 0,
        y: 0,
        points: [x, y, x, y],
        id: uuidv4(),
        label: capitalize(tool),
      });
      SET_CREATE_CITEM([createStartElement]);
    }
  };

  // ===== CREATING MODE HANDLERS =====
  const handleCreatingMode = (x: number, y: number) => {
    const newShape = CURRENT_ITEM.at(0);
    if (!newShape) return;

    if (TOOLS_BOX_BASED.includes(newShape.tool)) {
      const updateShape = UpdateShapeDimension(x, y, newShape);
      SET_UPDATE_CITEM([updateShape]);
    }
    if (TOOLS_LINE_BASED.includes(newShape.tool)) {
      const updateShape = UpdateShapeDimension(x, y, {
        ...newShape,
        points: [newShape?.points?.[0] ?? 0, newShape?.points?.[1] ?? 0, x, y],
      });
      SET_UPDATE_CITEM([updateShape]);
    }
    if (TOOLS_DRAW_BASED.includes(newShape.tool)) {
      const updateShape = UpdateShapeDimension(x, y, {
        ...newShape,
        points: newShape.points?.concat([x, y]),
      });
      SET_UPDATE_CITEM([updateShape]);
    }
  };

  // ===== COMPLETION HANDLERS =====
  const handleCreatingComplete = (payloads: typeof CURRENT_ITEM) => {
    for (const newShape of payloads) {
      SET_CREATE(newShape);

      if (TOOLS_BOX_BASED.includes(newShape.tool)) {
        setTimeout(() => {
          setShapeId({
            id: newShape?.id,
            parentId: newShape?.parentId,
          });
        }, 10);
        SET_EVENT_STAGE("IDLE");
        setTool("MOVE");
      }
      if (TOOLS_LINE_BASED.includes(newShape.tool)) {
        SET_EVENT_STAGE("CREATE");
        setTool("LINE");
      }
      if (TOOLS_DRAW_BASED.includes(newShape.tool)) {
        SET_EVENT_STAGE("CREATE");
        setTool("DRAW");
      }
    }
    SET_CLEAR_CITEM();
  };

  // ===== UTILITY FUNCTIONS =====
  const toolKeydown = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
  };

  const handleDeleteShapes = () => {
    DELETE_SHAPE();
  };

  const createImageFromFile = (file: File, dataUrl: string) => {
    const image = new Image();
    image.src = dataUrl;
    image.onload = () => {
      const createStartElement = CreateShapeSchema({
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
    const createStartElement = CreateShapeSchema({
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

      const createStartElement = CreateShapeSchema({
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

      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      const alt = event.altKey;
      const key = event.key.toLowerCase();

      // ✅ Undo (IR HACIA ATRÁS)
      if (meta && !event.shiftKey && key === "z") {
        event.preventDefault();
        setUndo();
        // set(UNDO_ATOM);
        return;
      }

      // ✅ Redo (IR HACIA ADELANTE)
      if (meta && event.shiftKey && key === "z") {
        event.preventDefault();
        setRedo();
        // set(REDO_ATOM);
        return;
      }

      if (PAUSE) return;

      // Handle delete operations
      if (DELETE_KEYS.includes(KEY)) {
        handleDeleteShapes();
        setTool("MOVE");
      }

      // Handle Alt key for copy mode
      if (KEY === "ALT") {
        SET_EVENT_STAGE("COPY");
      }
      if (KEY === "SHIFT") {
        SET_EVENT_STAGE("MULTI_SELECT");
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

    const handleFile = (file: File): void => {
      const reader = new FileReader();
      reader.onload = (data) => {
        if (typeof data?.target?.result === "string") {
          createImageFromFile(file, data.target.result);
        }
      };
      reader.readAsDataURL(file);
    };

    const handleSVG = (svgText: string): void => {
      const parser = new DOMParser();
      const svgDOM = parser
        .parseFromString(svgText, "image/svg+xml")
        .querySelector("svg");
      if (!svgDOM) return;

      const serializer = new XMLSerializer();
      createImageFromSVG(serializer.serializeToString(svgDOM));
    };

    const handlePaste = (event: ClipboardEvent): void => {
      const clipboardText: string | null =
        event.clipboardData?.getData("text") ?? null;
      const file: File | undefined = event.clipboardData?.files[0];

      if (file) {
        handleFile(file);
        return;
      }

      if (!clipboardText) return;

      const trimmed = clipboardText.trim();
      if (trimmed.startsWith("<svg")) {
        handleSVG(trimmed);
        return;
      }

      if (shapeId?.length === 0) {
        createTextFromClipboard(trimmed);
      }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === "Shift" || event.key === "Alt") {
        SET_EVENT_STAGE("IDLE");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("paste", handlePaste);
    };
  }, [tool, shapeId, config.tools, PAUSE]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
