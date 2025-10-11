/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { cursor_event, STAGE_IDS } from "./constants/stage";
import { useEventStage } from "./hooks/useEventStage";
import { Tools } from "./sidebar/Tools";
import STAGE_CANVAS_BACKGROUND from "./states/canvas";
import { EVENT_ATOM } from "./states/event";
import { MOVING_MOUSE_BUTTON_ATOM } from "./states/moving";
import { RESET_SHAPES_IDS_ATOM } from "./states/shape";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "./states/tool";

const PxStage = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const [tool, setTool] = useAtom(TOOL_ATOM);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const event = useAtomValue(EVENT_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);
  const MOVING = useAtomValue(MOVING_MOUSE_BUTTON_ATOM);
  const { handleMouseDown, handleMouseUp, handleMouseMove, stageRef } =
    useEventStage();

  const MAX_SCALE = 90;
  const MIN_SCALE = 0.1;

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerSize({ width: clientWidth, height: clientHeight });
    };

    requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleClear = (e: KonvaEventObject<MouseEvent>) => {
    if (["DRAW", "LINE", "CLIP"].includes(tool)) return;
    const targetId = e?.target?.attrs?.id;
    if (STAGE_IDS.includes(targetId)) {
      setPause(false);
      resetShapesIds();
      setTool("MOVE");
    }
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (e.evt.ctrlKey || e.evt.metaKey) {
      e.evt.preventDefault();
      const scaleBy = 1.05;
      let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      stage.batchDraw();
    } else {
      e.evt.preventDefault();
      const pos = stage.position();
      const newPos = {
        x: pos.x - e.evt.deltaX,
        y: pos.y - e.evt.deltaY,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  };

  return (
    <section
      className={css({
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <div>
        <Tools />
      </div>

      <div
        ref={containerRef}
        className={`${cursor_event[event]} ${css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        })}`}
      >
        <Stage
          id="pixel-kit-stage"
          ref={stageRef}
          draggable={MOVING}
          width={containerSize.width}
          height={containerSize.height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onWheel={handleWheel}
          onMouseup={handleMouseUp}
          onClick={handleClear}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: background,
          }}
        >
          {children}
        </Stage>
      </div>
    </section>
  );
};

export default PxStage;
