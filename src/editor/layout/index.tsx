import { css } from "@stylespixelkit/css";
import { FC, ReactNode } from "react";
import ToolsTop from "./Tools";
import LayoutEditorSidebarLeft from "./left";
import LayoutEditorSidebarRight from "./right";

type Props = {
  children: ReactNode;
};

const LayoutPixelEditor: FC<Props> = ({ children }) => {
  return (
    <main
      className={css({
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <LayoutEditorSidebarLeft />
      <ToolsTop />
      {children}
      <LayoutEditorSidebarRight />
    </main>
  );
};

export default LayoutPixelEditor;
