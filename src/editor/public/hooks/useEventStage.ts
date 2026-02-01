/* eslint-disable react-hooks/exhaustive-deps */
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { CLEAR_CURRENT_ITEM_ATOM } from "../../states/currentItem";
import { POSITION_PAGE_ATOM, POSITION_SCALE_ATOM } from "../../states/pages";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../../states/shape";
import {
  GET_STAGE_BOUNDS_ATOM,
  GROUP_SHAPES_IN_LAYOUT,
} from "../../states/shapes";
// import { REDO_ATOM, UNDO_ATOM } from "../states/undo-redo";

import { useConfiguration } from "../../hooks/useConfiguration";
import { START_TIMER_ATOM } from "../../states/timer";

// ===== CONSTANTS =====

export const useEvents = () => {
  // ===== STATE HOOKS =====
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const shapeId = useAtomValue(SELECTED_SHAPES_BY_IDS_ATOM);
  // ===== READ-ONLY STATE =====
  const PAUSE = useAtomValue(PAUSE_MODE_ATOM);
  const setScale = useSetAtom(POSITION_SCALE_ATOM);
  const setPosition = useSetAtom(POSITION_PAGE_ATOM);
  const { config } = useConfiguration();
  const START = useSetAtom(START_TIMER_ATOM);

  const stageRef = useRef<Konva.Stage>(null);
  const GET_BOUNDS = useSetAtom(GET_STAGE_BOUNDS_ATOM);
  const SET_CLEAR_CITEM = useSetAtom(CLEAR_CURRENT_ITEM_ATOM);
  // const setRedo = useSetAtom(REDO_ATOM);
  // const setUndo = useSetAtom(UNDO_ATOM);
  const SET_EVENT_GROUP = useSetAtom(GROUP_SHAPES_IN_LAYOUT);

  // ===== MOUSE EVENT HANDLERS =====

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
        START();

        // set(UNDO_ATOM);
        return;
      }
      // ✅ Agrupar en Layout (Shift + A)
      if (shift && key === "a" && shapeId?.length > 0) {
        event.preventDefault();
        SET_EVENT_GROUP();
        START();

        return;
      }

      // ✅ Redo (IR HACIA ADELANTE)
      if (meta && event.shiftKey && key === "z") {
        event.preventDefault();
        // setRedo();
        START();

        // set(REDO_ATOM);
        return;
      }

      if (PAUSE) return;
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
      if (event.key === "Shift" || event.key === "Alt") {
        setTool("MOVE");
        SET_CLEAR_CITEM();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [tool, shapeId, config.tools, PAUSE]);

  return {
    stageRef,
    zoomToFitAllShapes,
  };
};
