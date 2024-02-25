import LayoutEditorSidebarLeft from "@/layout/editor/sidebar/left";

import { FC, ReactNode } from "react";
import { css } from "../../../styled-system/css";
import LayoutEditorTop from "@/layout/editor/sidebar/top";
import LayoutEditorSidebarRight from "@/layout/editor/sidebar/right";
type Props = {
  children: ReactNode;
};

const LayoutEditor: FC<Props> = ({ children }) => {
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

export default LayoutEditor;
