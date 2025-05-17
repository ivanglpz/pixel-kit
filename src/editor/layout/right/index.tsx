import { Dispatch, FC, RefObject, SetStateAction, useState } from "react";
import StageConfig from "./canvas";
import { css } from "@stylespixelkit/css";
import { Drawing } from "./drawing";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { Valid } from "@/components/valid";
import { motion, useDragControls } from "framer-motion";

import { DragControls } from "framer-motion";
import { useReference } from "@/editor/hooks/useReference";
import { Clip } from "./clip";
import { Tools } from "./tools";
import { useBrowserType } from "@/editor/hooks/useTypeBrowser";
import { ExportStage } from "./export";

interface Props {
  dragControls: DragControls;
  showConfig: boolean;
  setshowConfig: Dispatch<SetStateAction<boolean>>;
}

export function HeaderConfiguration() {
  return (
    <section
      className={css({
        paddingLeft: "md",
        paddingRight: "md",
        display: "grid",
        flexDirection: "row",
        backgroundColor: "primary",
        border: "container",
        borderRadius: "md",
        backgroundSize: "0.5rem 0.5rem",
        backgroundRepeat: "round",
        justifyContent: "space-between",
        alignItems: "center",
        gridTemplateColumns: "1fr 25px",
        height: "35px",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: "100%",
          gap: "md",
        })}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_423_271"
            maskUnits="userSpaceOnUse"
            x="3"
            y="3"
            width="14"
            height="14"
          >
            <path
              d="M15 3H17V9H15V5H5V15H9V17H3V3H15ZM11 13V11H17V13H15V15H13V17H11V13ZM15 15V17H17V15H15Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_423_271)">
            <path
              d="M12.375 7.625H17V3H12.375V7.625ZM12.375 9.66071V14.2857H17V9.66071H12.375ZM11.6964 9.66071H7.07143V14.2857H11.6964V9.66071ZM11.6964 8.30357H16.3214V3.67857H11.6964V8.30357ZM8.30357 8.30357V3.67857H3.67857V8.30357H8.30357ZM8.30357 11.6964H3.67857V16.3214H8.30357V11.6964ZM9.66071 11.6964H14.2857V7.07143H9.66071V11.6964ZM9.66071 12.375V17H14.2857V12.375H9.66071ZM7.625 12.375H3V17H7.625V12.375ZM7.625 7.625V3H3V7.625H7.625ZM10.3393 10.3393V5.71428H5.71428V10.3393H10.3393ZM12.375 10.3393H17V5.71428H12.375V10.3393ZM12.375 11.0179V15.6429H17V11.0179H12.375ZM11.6964 11.0179V6.39285H7.07143V11.0179H11.6964ZM11.0179 11.6964V7.07143H6.39285V11.6964H11.0179ZM11.0179 12.375V17H15.6429V12.375H11.0179ZM10.3393 12.375H5.71428V17H10.3393V12.375ZM11.6964 12.375H7.07143V17H11.6964V12.375ZM12.375 12.375V17H17V12.375H12.375ZM12.375 11.6964H17V7.07143H12.375V11.6964ZM11.6964 12.25H12.375V3H11.6964V12.25ZM7.74999 7.625V9.66071H17V7.625H7.74999ZM12.375 5.03571H11.6964V14.2857H12.375V5.03571ZM16.3214 9.66071V8.30357H7.07143V9.66071H16.3214ZM11.6964 3.67857H8.30357V12.9286H11.6964V3.67857ZM3.67857 8.30357V11.6964H12.9286V8.30357H3.67857ZM8.30357 16.3214H9.66071V7.07143H8.30357V16.3214ZM5.03571 11.6964V12.375H14.2857V11.6964H5.03571ZM9.66071 7.74999H7.625V17H9.66071V7.74999ZM12.25 12.375V7.625H3V12.375H12.25ZM7.625 12.25H11.6964V3H7.625V12.25ZM14.9643 11.0179V10.3393H5.71428V11.0179H14.9643ZM10.3393 14.9643H12.375V5.71428H10.3393V14.9643ZM7.74999 10.3393V11.0179H17V10.3393H7.74999ZM12.375 6.39285H11.6964V15.6429H12.375V6.39285ZM7.07143 11.0179V11.6964H16.3214V11.0179H7.07143ZM11.6964 7.07143H11.0179V16.3214H11.6964V7.07143ZM6.39285 11.6964V12.375H15.6429V11.6964H6.39285ZM11.0179 7.74999H10.3393V17H11.0179V7.74999ZM14.9643 12.375V11.0179H5.71428V12.375H14.9643ZM7.07143 11.6964V12.375H16.3214V11.6964H7.07143ZM11.6964 17H12.375V7.74999H11.6964V17ZM17 12.375V11.6964H7.74999V12.375H17ZM12.375 7.07143H11.6964V16.3214H12.375V7.07143Z"
              fill="white"
            />
          </g>
        </svg>

        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Pixel Kit v4
        </p>
      </div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        1
      </div>
    </section>
  );
}

const LayoutEditorSidebarRight: FC = () => {
  const { config } = useConfiguration();
  const { ref } = useReference({ type: "CONTAINER" });
  const browser = useBrowserType();

  return (
    <aside
      className={css({
        // webmaxHeight: "fit-content",
        backgroundColor: "rgba(0,0,0,0.15)",
        borderRadius: "sm",
        zIndex: 9,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "scroll",
        padding: "md",
      })}
    >
      <HeaderConfiguration />
      <Tools />
      <Valid isValid={config?.showCanvasConfig}>
        <StageConfig />
      </Valid>
      <Valid isValid={config.showClipImageConfig}>
        <Clip />
      </Valid>
      <Drawing />
      <div
        id="pixel-kit-sidebar-right"
        style={{
          padding: "0px",
          margin: "0",
        }}
      ></div>
      <ExportStage />
    </aside>
  );
};

export default LayoutEditorSidebarRight;
