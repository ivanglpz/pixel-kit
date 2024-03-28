import { css } from "@stylespixelkit/css";
import { FC, ReactNode } from "react";
import ToolsTop from "../Tools";
import LayoutEditorSidebarRight from "../right";
import { LayoutDrawSidebarLeft } from "./leftSidebar";

type Props = {
  children: ReactNode;
};

export const LayoutPixelEditorDraw: FC<Props> = ({ children }) => {
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
      <LayoutDrawSidebarLeft />
      <ToolsTop />
      {children}
      <LayoutEditorSidebarRight />
    </main>
  );
};
