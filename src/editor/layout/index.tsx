import { css } from "@stylespixelkit/css";
import { FC, ReactNode } from "react";
import LayoutEditorTop from "./sidebar/top";
import LayoutEditorSidebarLeft from "./sidebar/left";
import LayoutEditorSidebarRight from "./sidebar/right";
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
      <LayoutEditorTop />
      <LayoutEditorSidebarLeft />
      {children}
      <LayoutEditorSidebarRight />
    </main>
  );
};

export default LayoutPixelEditor;
