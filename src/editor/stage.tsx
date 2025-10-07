/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, ReactNode, useEffect, useRef } from "react";
import { Stage } from "react-konva";
import { useConfiguration } from "./hooks/useConfiguration";
import { useEventStage } from "./hooks/useEventStage";
import { useReference } from "./hooks/useReference";
import { Tools } from "./sidebar/Tools";
import { EVENT_ATOM, IStageEvents } from "./states/event";
import { RESET_SHAPES_IDS_ATOM } from "./states/shape";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "./states/tool";

type Props = {
  children: ReactNode;
};

const PxStage: FC<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const { config } = useConfiguration(); // ✅ Ahora usamos config.expand2K
  const event = useAtomValue(EVENT_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
  const { handleMouseDown, handleMouseUp, handleMouseMove } = useEventStage();

  const { handleSetRef } = useReference({
    type: "STAGE",
    ref: stageRef,
  });

  const handleClear = (e: KonvaEventObject<MouseEvent>) => {
    if (["DRAW", "LINE", "CLIP"].includes(tool)) return;

    const targetId = e?.target?.attrs?.id;
    if (
      [null, undefined, "main-image-render-stage", "pixel-kit-stage"].includes(
        targetId
      )
    ) {
      setPause(false);
      resetShapesIds();
      setTool("MOVE");
    }
  };

  // ✅ Definimos el tamaño final del Stage
  // ✅ Versión 4K

  const dimension = config.expand_stage_resolution;

  const MAX_SCALE = 10; // Máximo zoom permitido
  const MIN_SCALE = 1; // Mínimo zoom permitido

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    // ✅ 1. ZOOM con CTRL o META
    if (e.evt.ctrlKey || e.evt.metaKey) {
      e.evt.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();
      let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      // Limitar zoom
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      stage.scale({ x: newScale, y: newScale });

      let newX = pointer.x - mousePointTo.x * newScale;
      let newY = pointer.y - mousePointTo.y * newScale;

      const scaledWidth = Number(dimension?.width) * newScale;
      const scaledHeight = Number(dimension?.height) * newScale;

      const containerWidth = stage.width();
      const containerHeight = stage.height();

      // Limitar horizontalmente
      if (scaledWidth <= containerWidth) {
        newX = (containerWidth - scaledWidth) / 2;
      } else {
        const minX = containerWidth - scaledWidth;
        const maxX = 0;
        newX = Math.max(minX, Math.min(maxX, newX));
      }

      // Limitar verticalmente
      if (scaledHeight <= containerHeight) {
        newY = (containerHeight - scaledHeight) / 2;
      } else {
        const minY = containerHeight - scaledHeight;
        const maxY = 0;
        newY = Math.max(minY, Math.min(maxY, newY));
      }

      stage.position({ x: newX, y: newY });
      stage.batchDraw();

      return; // ✅ Evita seguir al scroll
    }

    // ✅ 2. SCROLL (solo si scrollInsideStage es true)
    if (config.scrollInsideStage) {
      e.evt.preventDefault();

      const currentPos = stage.position();
      const currentScale = stage.scaleX();

      const scaledWidth = Number(dimension?.width) * currentScale;
      const scaledHeight = Number(dimension?.height) * currentScale;

      const containerWidth = stage.width();
      const containerHeight = stage.height();

      let newX = currentPos.x;
      let newY = currentPos.y;

      if (e.evt.shiftKey) {
        // ✅ Shift = scroll horizontal (usar deltaX si lo hay, sino deltaY)
        const delta = e.evt.deltaX !== 0 ? e.evt.deltaX : e.evt.deltaY;
        newX -= delta;
      } else {
        // ✅ Scroll vertical
        newY -= e.evt.deltaY;
      }

      // 🔒 Limitar horizontalmente
      if (scaledWidth <= containerWidth) {
        newX = (containerWidth - scaledWidth) / 2;
      } else {
        const minX = containerWidth - scaledWidth;
        const maxX = 0;
        newX = Math.max(minX, Math.min(maxX, newX));
      }

      // 🔒 Limitar verticalmente
      if (scaledHeight <= containerHeight) {
        newY = (containerHeight - scaledHeight) / 2;
      } else {
        const minY = containerHeight - scaledHeight;
        const maxY = 0;
        newY = Math.max(minY, Math.min(maxY, newY));
      }

      stage.position({ x: newX, y: newY });
      stage.batchDraw();
    }
  };

  useEffect(() => {
    if (stageRef?.current) {
      handleSetRef({
        type: "STAGE",
        ref: stageRef,
      });
    }
  }, [, stageRef, config.expand_stage]);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    // Esperar a que el layout se calcule
    requestAnimationFrame(() => {
      const scrollX = (container.scrollWidth - container.clientWidth) / 2;
      const scrollY = (container.scrollHeight - container.clientHeight) / 2;

      container.scrollLeft = scrollX;
      container.scrollTop = scrollY;
    });
  }, [config.expand_stage, dimension]);

  const cursorByEvent: { [key in IStageEvents]: string } = {
    CREATE: "custom-cursor-crosshair",
    COPY: "custom-cursor-arrow-duplicate",
    COPYING: "custom-cursor-arrow-duplicate",
    CREATING: "custom-cursor-crosshair",
    IDLE: "CursorDefault",
    MULTI_SELECT: "CursorDefault",
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
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          gap: "md",
          left: -1,
          top: -2,
          backgroundColor: "bg",
          padding: "md",
          // borderRadius: "lg",
          borderTopRightRadius: "lg",
          borderBottomRightRadius: "lg",
          borderWidth: "1.5px",
          borderStyle: "solid",
          zIndex: "10",
          borderColor: "border", // ← usa el semantic token
        })}
      >
        <Tools />
      </section>
      <div
        ref={containerRef}
        className={`${cursorByEvent[event]} ${css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "100%",
          position: "relative",
        })}`}
        style={{
          overflow: config.expand_stage ? "scroll" : "hidden",
        }}
      >
        <Stage
          id="pixel-kit-stage"
          ref={stageRef}
          width={Number(dimension?.width)}
          height={Number(dimension?.height)}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onWheel={handleWheel} // 👈 Zoom real en HD
          onMouseup={handleMouseUp}
          onClick={handleClear}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </Stage>
      </div>
    </section>
  );
};

export default PxStage;
