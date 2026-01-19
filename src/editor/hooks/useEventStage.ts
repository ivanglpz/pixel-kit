/* eslint-disable react-hooks/exhaustive-deps */
import { IPhoto } from "@/db/schemas/types";
import TOOL_ATOM, {
  IKeyTool,
  IShapeTool,
  PAUSE_MODE_ATOM,
} from "@/editor/states/tool";
import { uploadPhoto } from "@/services/photo";
import { optimizeImageFile } from "@/utils/opt-img";
import { useMutation } from "@tanstack/react-query";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOUSE } from "../constants/mouse";
import { STAGE_IDS } from "../constants/stage";
import stageAbsolutePosition from "../helpers/position";
import { CreateShapeSchema } from "../helpers/shape-schema";
import { ShapeImage } from "../shapes/types/shape.base";
import { CLEAR_CURRENT_ITEM_ATOM } from "../states/currentItem";
import { EVENT_ATOM } from "../states/event";
import { MOVING_MOUSE_BUTTON_ATOM } from "../states/moving";
import { POSITION_PAGE_ATOM, POSITION_SCALE_ATOM } from "../states/pages";
import { PROJECT_ID_ATOM } from "../states/projects";
import {
  RECTANGLE_SELECTION_ATOM,
  SELECT_AREA_SHAPES_ATOM,
} from "../states/rectangle-selection";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import {
  CREATE_SHAPE_ATOM,
  DELETE_KEYS,
  DELETE_SHAPES_ATOM,
  EVENT_COPY_CREATING_SHAPES,
  EVENT_COPY_FINISH_SHAPES,
  EVENT_COPY_START_SHAPES,
  EVENT_DOWN_CREATING_SHAPES,
  EVENT_DOWN_FINISH_SHAPES,
  EVENT_DOWN_START_SHAPES,
  GET_STAGE_BOUNDS_ATOM,
  GROUP_SHAPES_IN_LAYOUT,
} from "../states/shapes";
// import { REDO_ATOM, UNDO_ATOM } from "../states/undo-redo";
import { SVG } from "../utils/svg";
import { useAutoSave } from "./useAutoSave";
import { useConfiguration } from "./useConfiguration";

// ===== CONSTANTS =====

export const useEventStage = () => {
  // ===== STATE HOOKS =====
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const shapeId = useAtomValue(SELECTED_SHAPES_BY_IDS_ATOM);
  const [EVENT_STAGE, SET_EVENT_STAGE] = useAtom(EVENT_ATOM);
  const SET_MOVING = useSetAtom(MOVING_MOUSE_BUTTON_ATOM);
  // ===== READ-ONLY STATE =====
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);
  const setScale = useSetAtom(POSITION_SCALE_ATOM);
  const setPosition = useSetAtom(POSITION_PAGE_ATOM);
  const { config } = useConfiguration();
  const { debounce } = useAutoSave();
  const PROJECT_ID = useAtomValue(PROJECT_ID_ATOM);
  const stageRef = useRef<Konva.Stage>(null);
  const GET_BOUNDS = useSetAtom(GET_STAGE_BOUNDS_ATOM);
  // ===== SETTERS =====
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPES_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const [selection, setSelection] = useAtom(RECTANGLE_SELECTION_ATOM);
  // const setRedo = useSetAtom(REDO_ATOM);
  // const setUndo = useSetAtom(UNDO_ATOM);
  const SET_EVENT_GROUP = useSetAtom(GROUP_SHAPES_IN_LAYOUT);

  const SET_EVENT_COPY_START_SHAPES = useSetAtom(EVENT_COPY_START_SHAPES);
  const SET_EVENT_COPY_CREATING_SHAPES = useSetAtom(EVENT_COPY_CREATING_SHAPES);
  const SET_EVENT_COPY_FINISH_SHAPES = useSetAtom(EVENT_COPY_FINISH_SHAPES);
  const SET_EVENT_DOWN_START_SHAPES = useSetAtom(EVENT_DOWN_START_SHAPES);
  const SET_EVENT_DOWN_CREATING_SHAPE = useSetAtom(EVENT_DOWN_CREATING_SHAPES);
  const SET_EVENT_DOWN_FINISH_SHAPES = useSetAtom(EVENT_DOWN_FINISH_SHAPES);

  const SET_SELECTION = useSetAtom(SELECT_AREA_SHAPES_ATOM);

  // ===== MOUSE EVENT HANDLERS =====
  const handleMouseDown = (event: KonvaEventObject<MouseEvent>) => {
    const mouse_button = event.evt.button;
    const { x, y } = stageAbsolutePosition(event);
    const targetId = event?.target?.attrs?.id;

    if (mouse_button === MOUSE.LEFT) {
      if (
        EVENT_STAGE === "IDLE" &&
        tool === "MOVE" &&
        STAGE_IDS.includes(targetId)
      ) {
        setSelection({
          x,
          y,
          width: 0,
          height: 0,
          visible: true,
        });
        SET_EVENT_STAGE("SELECT_AREA");
      }
      if (EVENT_STAGE === "CREATE") {
        SET_EVENT_DOWN_START_SHAPES({ x, y });
      }
      if (EVENT_STAGE === "COPY") {
        SET_EVENT_COPY_START_SHAPES({ x, y });
      }
      SET_MOVING(false);
    }
  };

  const handleMouseMove = (event: KonvaEventObject<MouseEvent>) => {
    const mouse_button = event.evt.button;
    const { x, y } = stageAbsolutePosition(event);

    if (mouse_button === MOUSE.LEFT) {
      if (EVENT_STAGE === "SELECT_AREA") {
        setSelection({
          ...selection,
          width: x - selection.x,
          height: y - selection.y,
          visible: true,
        });
      }

      if (EVENT_STAGE === "CREATING") {
        SET_EVENT_DOWN_CREATING_SHAPE({ x, y });
      }
      if (EVENT_STAGE === "COPYING") {
        SET_EVENT_COPY_CREATING_SHAPES({ x, y });
      }
    }
  };

  const handleMouseUp = async (event: KonvaEventObject<MouseEvent>) => {
    if (EVENT_STAGE === "SELECT_AREA") {
      SET_SELECTION();
    }
    if (EVENT_STAGE === "COPYING") {
      SET_EVENT_COPY_FINISH_SHAPES();
      debounce.execute();
    }
    if (EVENT_STAGE === "CREATING") {
      SET_EVENT_DOWN_FINISH_SHAPES();
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
      photoUpload: File,
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
        tool: atom<IShapeTool>("IMAGE"),
        x: atom(0),
        y: atom(0),
        width: atom(values.width / 3),
        height: atom(values.height / 3),
        image: atom<ShapeImage>({
          src: values.url,
          width: values.width,
          height: values.height,
          name: values.name,
        }),
      });
      SET_CREATE(createStartElement);

      debounce.execute();
      toast.success("Image uploaded successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createImageFromFile = async (file: File): Promise<void> => {
    if (
      !["IMAGE/JPEG", "IMAGE/PNG", "IMAGE/GIF", "IMAGE/SVG+XML"].includes(
        file.type.toUpperCase(),
      )
    ) {
      toast.error("Invalid image format");
      return;
    }

    toast.info("Optimizing image...", { duration: 4000 });

    const optimizedFile = await optimizeImageFile({
      file,
      quality: 25,
    });

    mutation.mutate(optimizedFile);
  };

  const createTextFromClipboard = (text: string) => {
    const createStartElement = CreateShapeSchema({
      id: uuidv4(),
      tool: atom<IShapeTool>("TEXT"),
      x: atom(0),
      y: atom(0),
      text: atom(text),
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
        tool: atom<IShapeTool>("ICON"),
        x: atom(0),
        y: atom(0),
        image: atom({
          src: SVG.Encode(svgString),
          width: img.width,
          height: img.height,
          name: `svg ${uuidv4().slice(0, 2)}`,
        }),
        label: atom(`svg ${uuidv4().slice(0, 2)}`),
      });
      SET_CREATE(createStartElement);
    };

    const dataImage = SVG.Encode(svgString);
    img.src = dataImage;
  };

  const zoomToFitAllShapes = () => {
    if (!stageRef.current) return;
    const bounds = GET_BOUNDS();
    if (!bounds) return;

    const stageWidth = stageRef.current.width();
    const stageHeight = stageRef.current.height();
    const scale =
      Math.min(stageWidth / bounds.width, stageHeight / bounds.height) * 0.9;

    setScale({ x: scale, y: scale });
    setPosition({
      x: -bounds.startX * scale + (stageWidth - bounds.width * scale) / 2,
      y: -bounds.startY * scale + (stageHeight - bounds.height * scale) / 2,
    });

    stageRef.current.batchDraw();
  };

  // ===== EVENT LISTENERS =====
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();
      const shift = event.shiftKey;
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      const key = event.key.toLowerCase();

      // ✅ Zoom to all shapes (Shift + 1)
      if (shift && event.code === "Digit1") {
        event.preventDefault();
        zoomToFitAllShapes();
        return;
      }

      // ✅ Undo (IR HACIA ATRÁS)
      if (meta && !event.shiftKey && key === "z") {
        event.preventDefault();
        // setUndo();
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
        // setRedo();
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
        ]),
      );

      if (keysActions[KEY]) {
        toolKeydown(keysActions[KEY].keyMethod);
        SET_EVENT_STAGE(keysActions[KEY].eventStage);
      }
    };
    const normalizeSvg = (raw: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, "image/svg+xml");
      const svg = doc.querySelector("svg");

      if (!svg) {
        throw new Error("Invalid SVG");
      }

      if (!svg.getAttribute("xmlns")) {
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }

      if (!svg.getAttribute("width")) {
        svg.setAttribute("width", "32");
      }

      if (!svg.getAttribute("height")) {
        svg.setAttribute("height", "32");
      }

      return new XMLSerializer().serializeToString(svg);
    };

    const handleSVG = (svgText: string): void => {
      const parser = new DOMParser();
      const svgDOM = parser
        .parseFromString(svgText, "image/svg+xml")
        .querySelector("svg");
      if (!svgDOM) return;

      const normalizedSvg = normalizeSvg(svgText);
      createImageFromSVG(normalizedSvg);
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
      if (trimmed.startsWith("<svg") && trimmed.endsWith("</svg>")) {
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
    stageRef,
  };
};
