/* eslint-disable react-hooks/exhaustive-deps */
import { IPhoto } from "@/db/schemas/types";
import TOOL_ATOM, { IKeyTool, PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { uploadPhoto } from "@/services/photo";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import stageAbsolutePosition from "../helpers/position";
import { CreateShapeSchema } from "../helpers/shape-schema";
import { CLEAR_CURRENT_ITEM_ATOM } from "../states/currentItem";
import { EVENT_ATOM } from "../states/event";
import { MOVING_MOUSE_BUTTON_ATOM } from "../states/moving";
import { PROJECT_ID_ATOM } from "../states/projects";
import { RECTANGLE_SELECTION_ATOM } from "../states/rectangle-selection";
import { SHAPE_IDS_ATOM, UPDATE_SHAPES_IDS_ATOM } from "../states/shape";
import {
  CREATE_SHAPE_ATOM,
  DELETE_KEYS,
  DELETE_SHAPES_ATOM,
  EVENT_COPYING_SHAPES,
  EVENT_DOWN_COPY,
  EVENT_DOWN_SHAPES,
  EVENT_MOVING_SHAPE,
  EVENT_UP_SHAPES,
  GROUP_SHAPES_IN_LAYOUT,
} from "../states/shapes";
import { REDO_ATOM, UNDO_ATOM } from "../states/undo-redo";
import { useAutoSave } from "./useAutoSave";
import { useConfiguration } from "./useConfiguration";
import { useReference } from "./useReference";

// ===== CONSTANTS =====

const MOUSE = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
};

export const useEventStage = () => {
  // ===== STATE HOOKS =====
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const shapeId = useAtomValue(SHAPE_IDS_ATOM);
  const [EVENT_STAGE, SET_EVENT_STAGE] = useAtom(EVENT_ATOM);
  const SET_MOVING = useSetAtom(MOVING_MOUSE_BUTTON_ATOM);
  // ===== READ-ONLY STATE =====
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);

  const { config } = useConfiguration();
  const { debounce } = useAutoSave();
  const PROJECT_ID = useAtomValue(PROJECT_ID_ATOM);

  // ===== SETTERS =====
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPES_ATOM);
  const SET_UPDATE_SHAPES_IDS = useSetAtom(UPDATE_SHAPES_IDS_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const [selection, setSelection] = useAtom(RECTANGLE_SELECTION_ATOM);
  const setRedo = useSetAtom(REDO_ATOM);
  const setUndo = useSetAtom(UNDO_ATOM);
  const SET_EVENT_GROUP = useSetAtom(GROUP_SHAPES_IN_LAYOUT);
  const SET_EVENT_UP = useSetAtom(EVENT_UP_SHAPES);
  const SET_EVENT_MOVING_SHAPE = useSetAtom(EVENT_MOVING_SHAPE);
  const SET_EVENT_COPYING = useSetAtom(EVENT_COPYING_SHAPES);
  const SET_EVENT_DOWN = useSetAtom(EVENT_DOWN_SHAPES);
  const SET_EVENT_DOWN_COPY = useSetAtom(EVENT_DOWN_COPY);
  const { ref: Stage } = useReference({ type: "STAGE" });

  // ===== MOUSE EVENT HANDLERS =====
  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    const mouse_button = event.evt.button;
    const { x, y } = stageAbsolutePosition(event);

    if (mouse_button === MOUSE.LEFT) {
      if (EVENT_STAGE === "CREATE") {
        SET_EVENT_DOWN({ x, y });
      }
      if (EVENT_STAGE === "COPY") {
        SET_EVENT_DOWN_COPY({ x, y });
      }
      SET_MOVING(false);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    const mouse_button = event.evt.button;
    const { x, y } = stageAbsolutePosition(event);

    if (mouse_button === MOUSE.LEFT) {
      if (EVENT_STAGE === "CREATING") {
        SET_EVENT_MOVING_SHAPE({ x, y });
      }
      if (EVENT_STAGE === "COPYING") {
        SET_EVENT_COPYING({ x, y });
      }
    }

    // if (
    //   selection.visible &&
    //   EVENT_STAGE === "IDLE" &&
    //   tool === "MOVE" &&
    //   shapeId?.length === 0
    // ) {
    //   setSelection({
    //     x: Math.min(selection.x, x),
    //     y: Math.min(selection.y, y),
    //     width: Math.abs(x - selection.x),
    //     height: Math.abs(y - selection.y),
    //     visible: true,
    //   });
    // }
  };

  const handleMouseUp = async (event: KonvaEventObject<MouseEvent>) => {
    // if (selection.visible && EVENT_STAGE === "IDLE" && tool === "MOVE") {
    //   const childrens = Stage?.current?.getStage?.()?.children;

    //   if (!childrens) return;
    //   const layer = childrens?.find((e) => e?.attrs?.id === "layer-shapes");
    //   const nodes = layer?.children?.filter?.(
    //     (child) =>
    //       child?.attrs?.id !== "transformer-editable" && child?.attrs?.listening
    //   );
    //   if (!nodes) return;
    //   const selected = nodes.filter((shape) =>
    //     Konva.Util.haveIntersection(selection, shape.getClientRect())
    //   );

    //   setTimeout(() => {
    //     SET_UPDATE_SHAPES_IDS(
    //       selected
    //         ?.map((e) => ({
    //           id: e?.attrs?.id,
    //           parentId: e?.attrs?.parentId,
    //         }))
    //         ?.filter((e) => typeof e?.id === "string")
    //     );
    //     setSelection({
    //       x: 0,
    //       y: 0,
    //       width: 0,
    //       height: 0,
    //       visible: false,
    //     });
    //   }, 10);
    // }

    if (EVENT_STAGE === "CREATING" || EVENT_STAGE === "COPYING") {
      SET_EVENT_UP();
      debounce.execute();
    }
    SET_MOVING(true);
  };

  // ===== UTILITY FUNCTIONS =====
  const toolKeydown = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
  };

  const mutation = useMutation({
    mutationKey: ["upload_event_image", PROJECT_ID],
    mutationFn: async (
      photoUpload: File
    ): Promise<Pick<IPhoto, "name" | "width" | "height" | "url">> => {
      const myImage = photoUpload;

      if (!myImage) {
        throw new Error("Please upload a photo from your device");
      }

      const formData = new FormData();
      formData.append("image", myImage); // usar el mismo nombre 'images'
      formData.append("projectId", `${PROJECT_ID}`); // usar el mismo nombre 'images'

      const response = await uploadPhoto(formData);
      return response;
    },
    onSuccess: (values) => {
      const createStartElement = CreateShapeSchema({
        id: uuidv4(),
        tool: "IMAGE",
        x: 0,
        y: 0,
        width: values.width / 3,
        height: values.height / 3,
        fills: [
          {
            color: "#fff",
            id: uuidv4(),
            image: {
              src: values.url,
              width: values.width,
              height: values.height,
              name: values.name,
            },
            opacity: 1,
            type: "image",
            visible: true,
          },
        ],
      });
      SET_CREATE(createStartElement);

      debounce.execute();
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createImageFromFile = (file: File) => {
    if (
      !["IMAGE/JPEG", "IMAGE/PNG", "IMAGE/GIF", "IMAGE/SVG+XML"].includes(
        file.type.toUpperCase()
      )
    ) {
      toast.error("Invalid image format.");
      return;
    }
    toast.info("Uploading image...", {
      duration: 6000,
    });
    mutation.mutate(file);
  };

  const createTextFromClipboard = (text: string) => {
    const createStartElement = CreateShapeSchema({
      id: uuidv4(),
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
        id: uuidv4(),
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
      const shift = event.shiftKey;
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      const alt = event.altKey;
      const key = event.key.toLowerCase();

      // ✅ Undo (IR HACIA ATRÁS)
      if (meta && !event.shiftKey && key === "z") {
        event.preventDefault();
        setUndo();
        debounce.execute();

        // set(UNDO_ATOM);
        return;
      }
      // ✅ Agrupar en Layout (Shift + A)
      if (shift && key === "a" && shapeId?.length > 0) {
        event.preventDefault();
        SET_EVENT_GROUP();
        debounce.execute();
        return;
      }

      // ✅ Redo (IR HACIA ADELANTE)
      if (meta && event.shiftKey && key === "z") {
        event.preventDefault();
        setRedo();
        debounce.execute();

        // set(REDO_ATOM);
        return;
      }

      if (PAUSE) return;

      // Handle delete operations
      if (DELETE_KEYS.includes(KEY)) {
        DELETE_SHAPE();
        setTool("MOVE");
        debounce.execute();
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
        toolKeydown(keysActions[KEY].keyMethod);
        SET_EVENT_STAGE(keysActions[KEY].eventStage);
      }
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
        createImageFromFile(file);
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
        setTool("MOVE");
        SET_CLEAR_CITEM();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("paste", handlePaste);
    };
  }, [tool, shapeId, config.tools, PAUSE]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
