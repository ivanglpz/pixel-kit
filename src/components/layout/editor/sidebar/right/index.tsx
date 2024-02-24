import { FC } from "react";
import { css } from "../../../../../../styled-system/css";
import StageConfig from "./stage";

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
    >
      <StageConfig />
    </aside>
  );
};

export default LayoutEditorSidebarRight;
