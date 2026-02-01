/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProject } from "@/db/schemas/types";
import { copyToClipboard } from "@/utils/clipboard";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Clipboard } from "lucide-react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { cursor_event, STAGE_IDS } from "../constants/stage";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";
import { EVENT_ATOM } from "../states/event";
import { MOVING_MOUSE_BUTTON_ATOM } from "../states/moving";
import { POSITION_PAGE_ATOM, POSITION_SCALE_ATOM } from "../states/pages";
import { BUILD_PROJET_PUBLIC } from "../states/projects";
import { RESET_SHAPES_IDS_ATOM } from "../states/shape";
import TOOL_ATOM, { PAUSE_MODE_ATOM } from "../states/tool";
import { useEvents } from "./hooks/useEventStage";

export const PixelKitStagePublic = ({
  children,
  project,
}: {
  children: ReactNode;
  project: IProject;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const SET_PUBLIC_PROJECT = useSetAtom(BUILD_PROJET_PUBLIC);
  const ID = router.query.id as string | undefined | null;

  const [containerSize, setContainerSize] = useState({
    width: 1,
    height: 1,
  });

  const [scale, setScale] = useAtom(POSITION_SCALE_ATOM);
  const [position, setPosition] = useAtom(POSITION_PAGE_ATOM);

  const [tool, setTool] = useAtom(TOOL_ATOM);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const event = useAtomValue(EVENT_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
  const background = useAtomValue(STAGE_CANVAS_BACKGROUND);
  const MOVING = useAtomValue(MOVING_MOUSE_BUTTON_ATOM);

  const { stageRef, zoomToFitAllShapes } = useEvents();

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

    e.evt.preventDefault();

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (e.evt.ctrlKey || e.evt.metaKey) {
      const scaleBy = 1.05;
      const oldScale = scale.x;

      let nextScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));

      const mousePointTo = {
        x: (pointer.x - position.x) / oldScale,
        y: (pointer.y - position.y) / oldScale,
      };

      const nextPosition = {
        x: pointer.x - mousePointTo.x * nextScale,
        y: pointer.y - mousePointTo.y * nextScale,
      };

      setScale({ x: nextScale, y: nextScale });
      setPosition(nextPosition);
      return;
    }

    setPosition((prev) => ({
      x: prev.x - e.evt.deltaX,
      y: prev.y - e.evt.deltaY,
    }));
  };

  useEffect(() => {
    SET_PUBLIC_PROJECT({ id: ID, autoZoom: zoomToFitAllShapes });
  }, [ID]);

  return (
    <section
      className={css({
        display: "grid",
        gridTemplateColumns: " 1fr",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <section className="absolute dark:bg-neutral-900 w-[250px] h-auto top-4 left-4 z-10 p-3 flex flex-col gap-2">
        <header className="flex flex-row items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2552_519)">
              <path
                d="M42.7068 0.210449H49.7896V21.4586H42.7068V7.29322H7.29322V42.7068H21.4586V49.7896H0.210449V0.210449H42.7068ZM28.5414 35.6242V28.5414H49.7896V35.6242H42.7068V42.7068H35.6242V49.7896H28.5414V35.6242ZM42.7068 42.7068V49.7896H49.7896V42.7068H42.7068Z"
                fill="black"
              />
              <mask
                id="mask0_2552_519"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="50"
                height="50"
              >
                <path
                  d="M42.7068 0.210449H49.7896V21.4586H42.7068V7.29322H7.29322V42.7068H21.4586V49.7896H0.210449V0.210449H42.7068ZM28.5414 35.6242V28.5414H49.7896V35.6242H42.7068V42.7068H35.6242V49.7896H28.5414V35.6242ZM42.7068 42.7068V49.7896H49.7896V42.7068H42.7068Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2552_519)">
                <path
                  d="M49.7896 0.210452H98.064V-48.064H49.7896V0.210452ZM49.7896 21.4586V69.733H98.064V21.4586H49.7896ZM42.7068 21.4586H-5.56757V69.733H42.7068V21.4586ZM42.7068 7.29322H90.9812V-40.9812H42.7068V7.29322ZM7.29322 7.29322V-40.9812H-40.9812V7.29322H7.29322ZM7.29322 42.7068H-40.9812V90.9812H7.29322V42.7068ZM21.4586 42.7068H69.733V-5.56757H21.4586V42.7068ZM21.4586 49.7896V98.064H69.733V49.7896H21.4586ZM0.210452 49.7896H-48.064V98.064H0.210452V49.7896ZM0.210452 0.210452V-48.064H-48.064V0.210452H0.210452ZM28.5414 28.5414V-19.733H-19.733V28.5414H28.5414ZM49.7896 28.5414H98.064V-19.733H49.7896V28.5414ZM49.7896 35.6242V83.8986H98.064V35.6242H49.7896ZM42.7068 35.6242V-12.6503H-5.56757V35.6242H42.7068ZM35.6242 42.7068V-5.56757H-12.6503V42.7068H35.6242ZM35.6242 49.7896V98.064H83.8986V49.7896H35.6242ZM28.5414 49.7896H-19.733V98.064H28.5414V49.7896ZM42.7068 49.7896H-5.56757V98.064H42.7068V49.7896ZM49.7896 49.7896V98.064H98.064V49.7896H49.7896ZM49.7896 42.7068H98.064V-5.56757H49.7896V42.7068ZM42.7068 48.4849H49.7896V-48.064H42.7068V48.4849ZM1.51517 0.210452V21.4586H98.064V0.210452H1.51517ZM49.7896 -26.8158H42.7068V69.733H49.7896V-26.8158ZM90.9812 21.4586V7.29322H-5.56757V21.4586H90.9812ZM42.7068 -40.9812H7.29322V55.5676H42.7068V-40.9812ZM-40.9812 7.29322V42.7068H55.5676V7.29322H-40.9812ZM7.29322 90.9812H21.4586V-5.56757H7.29322V90.9812ZM-26.8158 42.7068V49.7896H69.733V42.7068H-26.8158ZM21.4586 1.51517H0.210452V98.064H21.4586V1.51517ZM48.4849 49.7896V0.210452H-48.064V49.7896H48.4849ZM0.210452 48.4849H42.7068V-48.064H0.210452V48.4849ZM76.8158 35.6242V28.5414H-19.733V35.6242H76.8158ZM28.5414 76.8158H49.7896V-19.733H28.5414V76.8158ZM1.51517 28.5414V35.6242H98.064V28.5414H1.51517ZM49.7896 -12.6503H42.7068V83.8986H49.7896V-12.6503ZM-5.56757 35.6242V42.7068H90.9812V35.6242H-5.56757ZM42.7068 -5.56757H35.6242V90.9812H42.7068V-5.56757ZM-12.6503 42.7068V49.7896H83.8986V42.7068H-12.6503ZM35.6242 1.51517H28.5414V98.064H35.6242V1.51517ZM76.8158 49.7896V35.6242H-19.733V49.7896H76.8158ZM-5.56757 42.7068V49.7896H90.9812V42.7068H-5.56757ZM42.7068 98.064H49.7896V1.51517H42.7068V98.064ZM98.064 49.7896V42.7068H1.51517V49.7896H98.064ZM49.7896 -5.56757H42.7068V90.9812H49.7896V-5.56757Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_2552_519">
                <rect width="50" height="50" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <p className="font-bold">Pixel kit</p>
        </header>
        <p className="font-bold text-sm">Project</p>
        <p className="text-sm">{project?.name ?? "mockup-project"}</p>
        <p className="font-bold text-sm">Created by</p>
        <div className="flex flex-row items-center gap-2">
          <img
            src={project?.createdBy?.photoUrl ?? ""}
            className="h-8 w-8 rounded-full"
          />
          <p className="text-sm">
            {project?.createdBy?.fullName ?? "user-001"}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p
            className={css({
              fontSize: "sm",
              fontWeight: 600,
            })}
          >
            URL
          </p>
          <div className="flex flex-row gap-2">
            <Input value={`${window.location.host}/project/${ID}`} />
            <Button
              variant={"default"}
              className="w-10 flex items-center justify-center"
              onClick={() => {
                copyToClipboard({
                  text: `${window.location.host}/project/${ID}`,
                });
              }}
            >
              <Clipboard size={14} />
            </Button>
          </div>
        </div>
      </section>
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
          scale={scale}
          x={position.x}
          y={position.y}
          onWheel={handleWheel}
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
