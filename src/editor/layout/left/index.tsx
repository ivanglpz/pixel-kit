import { FC } from "react";
import { css } from "@stylespixelkit/css";
import { ImageConfiguration } from "./image";
import { ExportStage } from "../right/export";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { Valid } from "@/components/valid";

const LayoutEditorSidebarLeft: FC = () => {
  const {
    config: { showFilesBrowser },
  } = useConfiguration();
  return (
    <aside
      className={css({
        height: "auto",
        position: "absolute",
        top: 5,
        left: 5,
        zIndex: 9,
        maxWidth: "200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
    >
      <Valid isValid={showFilesBrowser}>
        <ImageConfiguration />
      </Valid>
      <ExportStage />
    </aside>
  );
};

export default LayoutEditorSidebarLeft;
