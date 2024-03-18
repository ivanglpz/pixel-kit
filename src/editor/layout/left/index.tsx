import { FC } from "react";
import { css } from "@stylespixelkit/css";

const LayoutEditorSidebarLeft: FC = () => {
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
    ></aside>
  );
};

export default LayoutEditorSidebarLeft;
