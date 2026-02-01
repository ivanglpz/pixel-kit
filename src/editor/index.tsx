/* eslint-disable @next/next/no-img-element */
import { IProject } from "@/db/schemas/types";
import { css } from "@stylespixelkit/css";
import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { useTimerAutoSave } from "./hooks/useTimerAutoSave";
import { AllLayers } from "./layers/root.layers";
import { LayerPublicShapes } from "./public/layers/shapes";
import { PixelKitStagePublic } from "./public/stage";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
import PxStage from "./stage";

const PixelKitPublic = (props: { project: IProject }) => {
  useStopZoom();

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
          gridTemplateColumns: "1fr",
          backgroundColor: "black",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: "100%",
        })}
      >
        <PixelKitStagePublic {...props}>
          <LayerPublicShapes />
        </PixelKitStagePublic>
      </div>
    </div>
  );
};
export const PixelKitPublicApp = dynamic(Promise.resolve(PixelKitPublic), {
  ssr: false,
});

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  useTimerAutoSave();
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
