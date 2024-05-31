import { Dispatch, FC, RefObject, SetStateAction, useState } from "react";
import StageConfig from "./canvas";
import { css } from "@stylespixelkit/css";
import { Drawing } from "./drawing";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { Valid } from "@/components/valid";
import { motion, useDragControls } from "framer-motion";

import { DragControls } from "framer-motion";
import { useReference } from "@/editor/hooks/reference";
import { Clip } from "./clip";
import { Tools } from "./tools";
import { useBrowserType } from "@/editor/hooks/useTypeBrowser";
import { ExportStage } from "./export";

interface Props {
  dragControls: DragControls;
  showConfig: boolean;
  setshowConfig: Dispatch<SetStateAction<boolean>>;
}

export function HeaderConfiguration({
  dragControls,
  setshowConfig,
  showConfig,
}: Props) {
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
          gap: "lg",
          cursor: "grab",
          width: "100%",
        })}
        onPointerDown={(event) => dragControls.start(event)}
        style={{ touchAction: "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 39 39"
          width="15"
          height="15"
        >
          <path
            d="M 5 0 C 7.761 0 10 2.239 10 5 C 10 7.761 7.761 10 5 10 C 2.239 10 0 7.761 0 5 C 0 2.239 2.239 0 5 0 Z"
            fill="white"
          ></path>
          <path
            d="M 19 0 C 21.761 0 24 2.239 24 5 C 24 7.761 21.761 10 19 10 C 16.239 10 14 7.761 14 5 C 14 2.239 16.239 0 19 0 Z"
            fill="white"
          ></path>
          <path
            d="M 33 0 C 35.761 0 38 2.239 38 5 C 38 7.761 35.761 10 33 10 C 30.239 10 28 7.761 28 5 C 28 2.239 30.239 0 33 0 Z"
            fill="white"
          ></path>
          <path
            d="M 33 14 C 35.761 14 38 16.239 38 19 C 38 21.761 35.761 24 33 24 C 30.239 24 28 21.761 28 19 C 28 16.239 30.239 14 33 14 Z"
            fill="white"
          ></path>
          <path
            d="M 19 14 C 21.761 14 24 16.239 24 19 C 24 21.761 21.761 24 19 24 C 16.239 24 14 21.761 14 19 C 14 16.239 16.239 14 19 14 Z"
            fill="white"
          ></path>
          <path
            d="M 5 14 C 7.761 14 10 16.239 10 19 C 10 21.761 7.761 24 5 24 C 2.239 24 0 21.761 0 19 C 0 16.239 2.239 14 5 14 Z"
            fill="white"
          ></path>
          <path
            d="M 5 28 C 7.761 28 10 30.239 10 33 C 10 35.761 7.761 38 5 38 C 2.239 38 0 35.761 0 33 C 0 30.239 2.239 28 5 28 Z"
            fill="white"
          ></path>
          <path
            d="M 19 28 C 21.761 28 24 30.239 24 33 C 24 35.761 21.761 38 19 38 C 16.239 38 14 35.761 14 33 C 14 30.239 16.239 28 19 28 Z"
            fill="white"
          ></path>
          <path
            d="M 33 28 C 35.761 28 38 30.239 38 33 C 38 35.761 35.761 38 33 38 C 30.239 38 28 35.761 28 33 C 28 30.239 30.239 28 33 28 Z"
            fill="white"
          ></path>
        </svg>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Properties
        </p>
      </div>
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <svg
          width="17"
          height="10"
          viewBox="0 0 17 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            rotate: showConfig ? "0deg" : "180deg",
            cursor: "pointer",
          }}
          onClick={() => setshowConfig((prev) => !prev)}
        >
          <path
            d="M0.365983 9.20473C0.600393 9.43907 0.918278 9.57072 1.24973 9.57072C1.58119 9.57072 1.89907 9.43907 2.13348 9.20473L8.32098 3.01723L14.5085 9.20473C14.7442 9.43243 15.06 9.55842 15.3877 9.55558C15.7155 9.55273 16.029 9.42127 16.2608 9.18951C16.4925 8.95775 16.624 8.64423 16.6268 8.31648C16.6297 7.98874 16.5037 7.67299 16.276 7.43723L9.20473 0.365983C8.97032 0.131644 8.65244 0 8.32098 0C7.98953 0 7.67164 0.131644 7.43723 0.365983L0.365983 7.43723C0.131644 7.67164 0 7.98953 0 8.32098C0 8.65244 0.131644 8.97032 0.365983 9.20473Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

const LayoutEditorSidebarRight: FC = () => {
  const { config } = useConfiguration();
  const dragControls = useDragControls();
  const { ref } = useReference({ type: "CONTAINER" });
  const [showConfig, setshowConfig] = useState(true);

  const browser = useBrowserType();
  console.log({ browser });

  return (
    <motion.aside
      drag="x"
      className={css({
        height: browser === "SAFARI" ? "100%" : "fit-content",
        // webmaxHeight: "fit-content",
        backgroundColor: "rgba(0,0,0,0.15)",
        maxHeight: browser === "SAFARI" ? "fit-content" : "100%",
        borderRadius: "sm",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 9,
        maxWidth: "180px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        overflow: "hidden",
        overflowX: "hidden",
        overflowY: "scroll",
        padding: "sm",
      })}
      dragListener={false}
      dragConstraints={
        ref?.current ? (ref as unknown as RefObject<HTMLDivElement>) : false
      }
      dragControls={dragControls}
    >
      <HeaderConfiguration
        dragControls={dragControls}
        showConfig={showConfig}
        setshowConfig={setshowConfig}
      />
      <Valid isValid={showConfig}>
        <Tools />
        <ExportStage />
        <Valid isValid={config?.showCanvasConfig}>
          <StageConfig />
        </Valid>
        <Valid isValid={config.showClipImageConfig}>
          <Clip />
        </Valid>
        <Drawing />
      </Valid>
      <div
        id="pixel-kit-sidebar-right"
        style={{
          display: showConfig ? "block" : "none",
          height: showConfig ? "auto" : "0px",
          padding: "0px",
          margin: "0",
        }}
      ></div>
    </motion.aside>
  );
};

export default LayoutEditorSidebarRight;
