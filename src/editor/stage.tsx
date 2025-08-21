/* eslint-disable react-hooks/exhaustive-deps */
import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { useEventStage } from "./hooks";
import { useConfiguration } from "./hooks/useConfiguration";
import { useReference } from "./hooks/useReference";
import { Tools } from "./sidebar/Tools";
import { STAGE_DIMENSION_ATOM } from "./states/dimension";
import { SHAPE_ID_ATOM } from "./states/shape";
import TOOL_ATOM from "./states/tool";

type Props = {
  children: ReactNode;
};

const PxStage: FC<Props> = ({ children }) => {
  const [{ height, width }, setDimension] = useAtom(STAGE_DIMENSION_ATOM);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [show, setShow] = useState(true);
  const [tool, setTool] = useAtom(TOOL_ATOM);

  const { config } = useConfiguration(); // ✅ Ahora usamos config.expand2K

  const setShapeId = useSetAtom(SHAPE_ID_ATOM);
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
      setShapeId(null);
      setTool("MOVE");
    }
  };

  const updateSize = () => {
    if (!containerRef.current) return;

    setShow(false); // 🔄 Oculta el Stage mientras actualiza

    const { width, height } = containerRef.current.getBoundingClientRect();

    if (!config.expand_stage) {
      setDimension({ width, height });
    }
    if (config.expand_stage && config.expand_stage_resolution) {
      setDimension(config.expand_stage_resolution);
    }

    requestAnimationFrame(() => {
      setShow(true);
    });
  };

  useEffect(() => {
    const timeout = requestAnimationFrame(updateSize);

    return () => cancelAnimationFrame(timeout);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => {
      if (containerRef.current) resizeObserver.unobserve(containerRef.current);
      window.removeEventListener("resize", updateSize);
    };
  }, [config.expand_stage]);

  // ✅ Definimos el tamaño final del Stage
  // ✅ Versión 4K

  const rstage = config.expand_stage_resolution;
  const stageWidth = config.expand_stage ? Number(rstage?.width) : width; // 4K horizontal
  const stageHeight = config.expand_stage ? Number(rstage?.height) : height; // 4K vertical

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

      const scaledWidth = stageWidth * newScale;
      const scaledHeight = stageHeight * newScale;

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

      const scaledWidth = stageWidth * currentScale;
      const scaledHeight = stageHeight * currentScale;

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
  }, [stageHeight, stageWidth, stageRef, config.expand_stage]);

  return (
    <div
      ref={containerRef}
      className={`CursorDefault ${css({
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
      <Valid isValid={show}>
        <Stage
          id="pixel-kit-stage"
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onWheel={handleWheel} // 👈 Zoom real en HD
          onMouseup={handleMouseUp}
          onTouchStart={(e) =>
            handleMouseDown(e as unknown as KonvaEventObject<MouseEvent>)
          }
          onTouchMove={(e) =>
            handleMouseMove(e as unknown as KonvaEventObject<MouseEvent>)
          }
          onTouchEnd={handleMouseUp}
          onClick={handleClear}
          onTap={handleClear}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </Stage>
      </Valid>
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          gap: "md",
          bottom: 15,
          backgroundColor: "bg",
          padding: "md",
          borderRadius: "lg",
          borderWidth: "1.5px",
          borderStyle: "solid",
          borderColor: "border", // ← usa el semantic token
        })}
      >
        <Tools />
      </section>
    </div>
  );
};

export default PxStage;
