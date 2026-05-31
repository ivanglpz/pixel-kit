/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ReactNode, useEffect, useRef, useState } from "react";
import { cursor_event } from "./constants/stage";
import { useEventStage } from "./hooks/useEventStage";
import { Tools } from "./sidebar/Tools";
import STAGE_CANVAS_BACKGROUND from "./states/canvas";
import { EVENT_ATOM } from "./states/event";
import { POSITION_PAGE_ATOM, POSITION_SCALE_ATOM } from "./states/pages";
import { RESET_SHAPES_IDS_ATOM } from "./states/shape";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "./states/tool";

const MAX_SCALE = 90;
const MIN_SCALE = 0.1;

const PxStage = ({ children }: { children: ReactNode }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 1, height: 1 });
  const [scale, setScale] = useAtom(POSITION_SCALE_ATOM);
  const [position, setPosition] = useAtom(POSITION_PAGE_ATOM);
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const event = useAtomValue(EVENT_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);

  const { handleMouseDown, handleMouseMove, handleMouseUp } =
    useEventStage(viewportRef);

  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      setViewportSize({
        width: viewportRef.current.clientWidth,
        height: viewportRef.current.clientHeight,
      });
    };

    requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const handleClear = (event: React.MouseEvent<HTMLDivElement>) => {
    if (["DRAW", "LINE", "CLIP"].includes(tool)) return;
    const target = event.target as HTMLElement;
    if (
      event.target !== event.currentTarget &&
      target.id !== "main-image-render-stage"
    ) {
      return;
    }

    setPause(false);
    resetShapesIds();
    setTool("MOVE");
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.ctrlKey || event.metaKey) {
      const scaleBy = 1.05;
      const oldScale = scale.x;
      const nextScale = Math.max(
        MIN_SCALE,
        Math.min(
          MAX_SCALE,
          event.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy,
        ),
      );

      const rect = event.currentTarget.getBoundingClientRect();
      const pointer = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      };

      setScale({ x: nextScale, y: nextScale });
      setPosition({
        x: pointer.x - mousePointTo.x * nextScale,
        y: pointer.y - mousePointTo.y * nextScale,
      });
      return;
    }

    setPosition((prev) => ({
      x: prev.x - event.deltaX,
      y: prev.y - event.deltaY,
    }));
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
        ref={viewportRef}
        id="pixel-kit-stage"
        className={`${cursor_event[event]} ${css({
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
        })}`}
        style={{ backgroundColor: background }}
        data-stage-width={viewportSize.width}
        data-stage-height={viewportSize.height}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        onPointerCancel={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClear}
      >
        <div
          id="main-image-render-stage"
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale.x}, ${scale.y})`,
            transformOrigin: "0 0",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default PxStage;
