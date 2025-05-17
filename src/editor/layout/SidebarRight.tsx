import { FC } from "react";
import StageConfig from "./canvas";
import { css } from "@stylespixelkit/css";
import { Drawing } from "./drawing";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { Valid } from "@/components/valid";
import { Clip } from "./clip";
import { ExportStage } from "./export";
import { Tools } from "./Tools";
import { HeaderLogo } from "./HeaderLogo";
import { ChangeEnv } from "../components/ChangeEnv";

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
      <div
        id="pixel-kit-sidebar-right"
        style={{
          padding: "0px",
          margin: "0",
        }}
      ></div>
      <ExportStage />
    </aside>
  );
};

export default SidebarRight;
