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
import { Tools } from "./Tools";

const SidebarRight: FC = () => {
  const { config } = useConfiguration();

  return (
    <aside
      className={css({
        backgroundColor: "rgba(0,0,0,0.15)",
        zIndex: 9,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "scroll",
        padding: "md",
        borderLeft: "1px solid gray",
        height: "100%",
      })}
    >
      <ChangeEnv />

      <Tools />
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
