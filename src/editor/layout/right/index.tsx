import { FC } from "react";
import StageConfig from "./canvas";
import { css } from "@stylespixelkit/css";
import { Drawing } from "./drawing";

const LayoutEditorSidebarRight: FC = () => {
  return (
    <aside
      className={css({
        height: "auto",
        position: "absolute",
        top: 5,
        right: 5,
        zIndex: 9,
        maxWidth: "200px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
      id="pixel-kit-sidebar-right"
    >
      <StageConfig />
      <Drawing />
    </aside>
  );
};

export default LayoutEditorSidebarRight;
