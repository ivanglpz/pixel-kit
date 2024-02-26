import { FC } from "react";
import StageConfig from "./stage";
import { css } from "@stylespixelkit/css";

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
    </aside>
  );
};

export default LayoutEditorSidebarRight;
