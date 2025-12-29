import { Valid } from "@/components/valid";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";
import { FC } from "react";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import TOOL_ATOM from "../states/tool";
import { StageCanvasColor } from "./canvas";
import { Drawing } from "./drawing";
import { LayoutShapeConfig } from "./sidebar-right-shape";

const SidebarRight: FC = () => {
  const { config } = useConfiguration();

  const shapeIds = useAtomValue(SELECTED_SHAPES_BY_IDS_ATOM);
  const tool = useAtomValue(TOOL_ATOM);

  return (
    <aside
      className={css({
        padding: "lg",
        backgroundColor: "bg",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderLeftColor: "border",
        overflow: "hidden",
        overflowY: "scroll",
        gap: "lg",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <Valid
        isValid={
          tool === "MOVE" && shapeIds.length === 0 && config?.show_canvas_config
        }
      >
        <StageCanvasColor />
      </Valid>
      <Valid isValid={tool === "MOVE" && shapeIds.length > 0}>
        <LayoutShapeConfig />
      </Valid>
      <Valid isValid={tool === "DRAW"}>
        <Drawing />
      </Valid>
    </aside>
  );
};

export default SidebarRight;
