import { css } from "@stylespixelkit/css";
import { FC } from "react";
import { Chat } from "../components/chat";
import { Segmentation } from "../components/segmentation";
import { SidebarLeftPages } from "./left/pages";
import { SidebarLeftShapes } from "./left/shapes";

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
      <Segmentation>
        <Segmentation.Item id="1" title="Layers">
          <div
            className={css({
              display: "grid",
              gridTemplateRows: "240px 1px 1fr",
              overflow: "hidden",
              height: "100%",
              gap: "lg",
            })}
          >
            <SidebarLeftPages />
            <div
              className={css({
                backgroundColor: "gray.500",
                width: "100%",
                height: 1,
                // paddingBottom: "lg",
              })}
            ></div>
            <SidebarLeftShapes />
          </div>
        </Segmentation.Item>
        {/* <Segmentation.Item id="2" title="Assets">
          <p>Contenido 2</p>
        </Segmentation.Item> */}
        <Segmentation.Item id="2" title="Chat">
          <Chat />
        </Segmentation.Item>
      </Segmentation>
    </aside>
  );
};
