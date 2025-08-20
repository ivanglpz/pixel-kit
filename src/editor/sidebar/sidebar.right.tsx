import { Valid } from "@/components/valid";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { StageMode } from "../components/ChangeEnv";
import { SHAPE_ID_ATOM } from "../states/shape";
import TOOL_ATOM from "../states/tool";
import { StageCanvasColor } from "./canvas";
import { Clip } from "./clip";
import { Drawing } from "./drawing";
import { ExportStage } from "./export";
import { LayoutShapeConfig } from "./sidebar-right-shape";

const SidebarRight: FC = () => {
  const { config } = useConfiguration();

  const shapeId = useAtomValue(SHAPE_ID_ATOM);
  const tool = useAtomValue(TOOL_ATOM);

  return (
    <aside
      className={css({
        padding: "lg",
        backgroundColor: "bg",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderLeftColor: "border", // ← usa el semantic token
        overflow: "hidden",
        overflowY: "scroll",
        gap: "lg",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <Valid isValid={tool === "MOVE"}>
        <Valid isValid={!shapeId}>
          <StageMode />
          <Valid isValid={config?.show_canvas_config}>
            <StageCanvasColor />
          </Valid>
        </Valid>
      </Valid>
      <Valid isValid={config?.show_clip_config}>
        <Clip />
      </Valid>
      <Drawing />
      <LayoutShapeConfig />
      <ExportStage />
    </aside>
  );
};

export default SidebarRight;
