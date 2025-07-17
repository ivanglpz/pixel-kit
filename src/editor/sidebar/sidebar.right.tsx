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
      })}
    >
      <ChangeEnv />

      <Valid isValid={config?.showCanvasConfig}>
        <StageConfig />
      </Valid>
      <Valid isValid={config?.showClipImageConfig}>
        <Clip />
      </Valid>
      <Drawing />
      <LayoutShapeConfig />

      <ExportStage />
    </aside>
  );
};

export default SidebarRight;
