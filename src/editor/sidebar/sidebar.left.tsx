import { css } from "@stylespixelkit/css";
import { FC } from "react";
import { SidebarLeftPages } from "./sidebar-left-pages";

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
            width: "100%",
            height: 1,
            _dark: {
              backgroundColor: "gray.700",
            },

            backgroundColor: "gray.150",
          })}
        ></div>

        {/* <SidebarLeftShapes /> */}
      </div>
    </aside>
  );
};
