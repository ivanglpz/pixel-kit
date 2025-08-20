import { css } from "@stylespixelkit/css";
import { FC } from "react";
import { SidebarLeftPages } from "./sidebar-left-pages";
import { SidebarLeftShapes } from "./sidebar-left-shapes";

export const SidebarLeft: FC = () => {
  return (
    <aside
      className={css({
        padding: "lg",
        backgroundColor: "bg",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: "border", // ← usa el semantic token
        overflow: "hidden",
      })}
    >
      {/* <Segmentation>
        <Segmentation.Item id="1" title="Layers"> */}
      <div
        className={css({
          display: "grid",
          gridTemplateRows: "180px 1px 1fr",
          overflow: "hidden",
          height: "100%",
          gap: "lg",
        })}
      >
        <SidebarLeftPages />

        <div
          className={css({
            backgroundColor: "gray.600",
            width: "100%",
            height: 1,
          })}
        ></div>

        <SidebarLeftShapes />
      </div>
    </aside>
  );
};
