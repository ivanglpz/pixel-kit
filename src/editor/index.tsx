/* eslint-disable @next/next/no-img-element */
import { css } from "@stylespixelkit/css";
import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/root.layers";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
import PxStage from "./stage";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();

  return (
    <div
      id="pixel-app"
      className={css({
        backgroundColor: "bg",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          backgroundColor: "black",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: "100%",
        })}
      >
        <SidebarLeft />
        <PxStage>
          <AllLayers />
        </PxStage>
        <SidebarRight />
      </div>
    </div>
  );
};
const ComponentApp = dynamic(Promise.resolve(PixelEditor), {
  ssr: false,
});

export default ComponentApp;
