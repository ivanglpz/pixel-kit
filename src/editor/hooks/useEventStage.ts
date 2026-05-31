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
import { RefObject, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOUSE } from "../constants/mouse";
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
import {
  PASTE_FROM_CLIPBOARD_ATOM,
  SET_CLIPBOARD_ATOM,
} from "../states/clipboard";
import { START_TIMER_ATOM } from "../states/timer";
import { SVG } from "../utils/svg";
import { useConfiguration } from "./useConfiguration";

const getStagePoint = (
  event: Pick<
    MouseEvent | React.PointerEvent<HTMLElement>,
    "clientX" | "clientY"
  >,
  viewport: HTMLElement | null,
  position: { x: number; y: number },
  scale: { x: number; y: number },
) => {
  if (!viewport) return { x: 0, y: 0 };
  const rect = viewport.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left - position.x) / scale.x,
    y: (event.clientY - rect.top - position.y) / scale.y,
  };
};

export const useEventStage = (viewportRef: RefObject<HTMLDivElement>) => {
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const shapeId = useAtomValue(SELECTED_SHAPES_BY_IDS_ATOM);
  const [EVENT_STAGE, SET_EVENT_STAGE] = useAtom(EVENT_ATOM);
  const SET_MOVING = useSetAtom(MOVING_MOUSE_BUTTON_ATOM);
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);
  const scale = useAtomValue(POSITION_SCALE_ATOM);
  const position = useAtomValue(POSITION_PAGE_ATOM);
  const setScale = useSetAtom(POSITION_SCALE_ATOM);
  const setPosition = useSetAtom(POSITION_PAGE_ATOM);
  const { config } = useConfiguration();
  const START = useSetAtom(START_TIMER_ATOM);
  const PROJECT_ID = useAtomValue(PROJECT_ID_ATOM);
  const GET_BOUNDS = useSetAtom(GET_STAGE_BOUNDS_ATOM);
  const SET_CREATE = useSetAtom(CREATE_SHAPE_ATOM);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPES_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  const [selection, setSelection] = useAtom(RECTANGLE_SELECTION_ATOM);
  const SET_EVENT_GROUP = useSetAtom(GROUP_SHAPES_IN_LAYOUT);
  const SET_EVENT_COPY_START_SHAPES = useSetAtom(EVENT_COPY_START_SHAPES);
  const SET_EVENT_COPY_CREATING_SHAPES = useSetAtom(EVENT_COPY_CREATING_SHAPES);
  const SET_EVENT_COPY_FINISH_SHAPES = useSetAtom(EVENT_COPY_FINISH_SHAPES);
  const SET_EVENT_DOWN_START_SHAPES = useSetAtom(EVENT_DOWN_START_SHAPES);
  const SET_EVENT_DOWN_CREATING_SHAPE = useSetAtom(EVENT_DOWN_CREATING_SHAPES);
  const SET_EVENT_DOWN_FINISH_SHAPES = useSetAtom(EVENT_DOWN_FINISH_SHAPES);
  const SET_CLIPBOARD = useSetAtom(SET_CLIPBOARD_ATOM);
  const PASTE_CLIPBOARD = useSetAtom(PASTE_FROM_CLIPBOARD_ATOM);
  const SET_SELECTION = useSetAtom(SELECT_AREA_SHAPES_ATOM);

  const handleMouseDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const targetIsStage =
      event.currentTarget === event.target ||
      target.id === "main-image-render-stage";
    const { x, y } = getStagePoint(event, viewportRef.current, position, scale);

    if (event.button === MOUSE.LEFT) {
      if (EVENT_STAGE === "IDLE" && tool === "MOVE" && targetIsStage) {
        setSelection({ x, y, width: 0, height: 0, visible: true });
        SET_EVENT_STAGE("SELECT_AREA");
      }
      if (EVENT_STAGE === "CREATE" && target.dataset.shapeId == null) {
        SET_EVENT_DOWN_START_SHAPES({ x, y });
      }
      if (EVENT_STAGE === "COPY") {
        SET_EVENT_COPY_START_SHAPES({ x, y });
      }
      SET_MOVING(false);
    }
  };

  const handleMouseMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = getStagePoint(event, viewportRef.current, position, scale);

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
  };

  const handleMouseUp = () => {
    if (EVENT_STAGE === "SELECT_AREA") {
      SET_SELECTION();
    }
    if (EVENT_STAGE === "COPYING") {
      SET_EVENT_COPY_FINISH_SHAPES();
      START();
    }
    if (EVENT_STAGE === "CREATING") {
      SET_EVENT_DOWN_FINISH_SHAPES();
      START();
    }
    SET_MOVING(true);
  };

  const toolKeydown = (kl: IKeyTool) => {
    setTool(kl);
    SET_CLEAR_CITEM();
  };

  const mutation = useMutation({
    mutationKey: ["upload_event_image", PROJECT_ID],
    mutationFn: async (
      photoUpload: File,
    ): Promise<Pick<IPhoto, "name" | "width" | "height" | "url">> => {
      const formData = new FormData();
      formData.append("image", photoUpload);
      formData.append("projectId", `${PROJECT_ID}`);
      return uploadPhoto(formData);
    },
    onSuccess: (values) => {
      SET_CREATE(
        CreateShapeSchema({
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
        }),
      );
      START();
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
    mutation.mutate(await optimizeImageFile({ file, quality: 25 }));
  };

  const createTextFromClipboard = (text: string) => {
    SET_CREATE(
      CreateShapeSchema({
        id: uuidv4(),
        tool: atom<IShapeTool>("TEXT"),
        x: atom(0),
        y: atom(0),
        text: atom(text),
      }),
    );
  };

  const createImageFromSVG = (svgString: string) => {
    const img = new Image();
    img.onload = function () {
      SET_CREATE(
        CreateShapeSchema({
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
        }),
      );
    };
    img.src = SVG.Encode(svgString);
  };

  const zoomToFitAllShapes = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const bounds = GET_BOUNDS();
    if (!bounds) return;

    const nextScale =
      Math.min(
        viewport.clientWidth / bounds.width,
        viewport.clientHeight / bounds.height,
      ) * 0.9;

    setScale({ x: nextScale, y: nextScale });
    setPosition({
      x:
        -bounds.startX * nextScale +
        (viewport.clientWidth - bounds.width * nextScale) / 2,
      y:
        -bounds.startY * nextScale +
        (viewport.clientHeight - bounds.height * nextScale) / 2,
    });
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const KEY = event.key?.toUpperCase();
      const shift = event.shiftKey;
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const meta = isMac ? event.metaKey : event.ctrlKey;
      const key = event.key.toLowerCase();

      if (meta && key === "c" && shapeId.length > 0) {
        event.preventDefault();
        SET_CLIPBOARD("COPY");
        return;
      }
      if (meta && key === "x" && shapeId.length > 0) {
        event.preventDefault();
        SET_CLIPBOARD("CUT");
        DELETE_SHAPE();
        START();
        return;
      }
      if (meta && key === "v") {
        event.preventDefault();
        PASTE_CLIPBOARD();
        START();
        return;
      }
      if (shift && event.code === "Digit1") {
        event.preventDefault();
        zoomToFitAllShapes();
        return;
      }
      if (meta && !event.shiftKey && key === "z") {
        event.preventDefault();
        START();
        return;
      }
      if (shift && key === "a" && shapeId?.length > 0) {
        event.preventDefault();
        SET_EVENT_GROUP();
        START();
        return;
      }
      if (meta && event.shiftKey && key === "z") {
        event.preventDefault();
        START();
        return;
      }
      if (PAUSE) return;

      if (DELETE_KEYS.includes(KEY)) {
        DELETE_SHAPE();
        setTool("MOVE");
        START();
      }
      if (KEY === "ALT") {
        SET_EVENT_STAGE("COPY");
      }
      if (KEY === "SHIFT") {
        SET_EVENT_STAGE("MULTI_SELECT");
      }

      const keysActions = Object.fromEntries(
        config.tools.map((item) => [
          item.keyBoard,
          {
            keyMethod: item.keyMethod,
            eventStage: item.eventStage,
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
      if (!svg) throw new Error("Invalid SVG");
      if (!svg.getAttribute("xmlns")) {
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }
      if (!svg.getAttribute("width")) svg.setAttribute("width", "32");
      if (!svg.getAttribute("height")) svg.setAttribute("height", "32");
      return new XMLSerializer().serializeToString(svg);
    };

    const handlePaste = (event: ClipboardEvent): void => {
      const clipboardText = event.clipboardData?.getData("text") ?? null;
      const file = event.clipboardData?.files[0];

      if (file) {
        createImageFromFile(file);
        return;
      }
      if (!clipboardText) return;

      const trimmed = clipboardText.trim();
      if (trimmed.startsWith("<svg") && trimmed.endsWith("</svg>")) {
        createImageFromSVG(normalizeSvg(trimmed));
        return;
      }
      if (shapeId?.length === 0) createTextFromClipboard(trimmed);
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
  }, [tool, shapeId, config.tools, PAUSE, scale, position]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
