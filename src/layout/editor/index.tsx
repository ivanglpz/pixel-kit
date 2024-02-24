import LayoutEditorSidebarLeft from "@/components/layout/editor/sidebar/left";
import LayoutEditorSidebarRight from "@/components/layout/editor/sidebar/right";

import { FC, ReactNode } from "react";
import { css } from "../../../styled-system/css";
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
      })}
    >
      <LayoutEditorSidebarLeft />
      {children}
    </main>
  );
};

export default LayoutEditor;
