/* eslint-disable react-hooks/exhaustive-deps */
import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { useEventStage, useTool } from "./hooks";
import { useConfiguration } from "./hooks/useConfiguration";
import { useReference } from "./hooks/useReference";
import { STAGE_DIMENSION_ATOM } from "./states/dimension";
import { SHAPE_ID_ATOM } from "./states/shape";

type Props = {
  children: ReactNode;
};

const PxStage: FC<Props> = ({ children }) => {
  const [{ height, width }, setDimension] = useAtom(STAGE_DIMENSION_ATOM);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [show, setShow] = useState(true);

  const { config } = useConfiguration(); // ✅ Ahora usamos config.expand2K
  const [scale, setScale] = useState(1);

  const setShapeId = useSetAtom(SHAPE_ID_ATOM);
  const { handleMouseDown, handleMouseUp, handleMouseMove } = useEventStage();
  const { tool, setTool } = useTool();

  const { handleSetRef } = useReference({
    type: "STAGE",
    ref: stageRef,
  });

  const handleClear = (e: KonvaEventObject<MouseEvent>) => {
    if (["DRAW", "LINE"].includes(tool)) return;

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

  const MAX_SCALE = 5; // Máximo zoom permitido
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
      setScale(newScale);

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
    <main
      ref={containerRef}
      className={`CursorDefault ${css({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        maxWidth: "100%",
      })}`}
      style={{
        overflowX: config.expand_stage ? "scroll" : "hidden", // ✅ Scroll horizontal si es expandido
        overflowY: config.expand_stage ? "scroll" : "hidden", // ✅ Scroll vertical si es expandido
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
        >
          {children}
        </Stage>
      </Valid>
      <Valid isValid={!show}>
        <p
          className={css({
            color: "text",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          {/* LOADER */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_865_433" fill="white">
              <path d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z" />
            </mask>
            <path
              d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z"
              fill="black"
            />
          </svg>
        </p>
      </Valid>
    </main>
  );
};

export default PxStage;
