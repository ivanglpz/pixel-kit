import { Valid } from "@/components/valid";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { FC } from "react";
import { ChangeEnv } from "../components/ChangeEnv";
import StageConfig from "./canvas";
import { Clip } from "./clip";
import { Drawing } from "./drawing";
import { ExportStage } from "./export";
import { LayoutShapeConfig } from "./shape-config";

const SidebarRight: FC = () => {
  const { config } = useConfiguration();

  return (
    <aside
      className={css({
        padding: "lg",
        backgroundColor: "bg",
        borderLeftWidth: "1px",
        borderLeftStyle: "solid",
        borderLeftColor: "border", // ← usa el semantic token
        overflow: "hidden",
        gap: "lg",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <ChangeEnv />

      <Valid isValid={config?.show_canvas_config}>
        <StageConfig />
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
