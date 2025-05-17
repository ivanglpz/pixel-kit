import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { PixelKitLayers } from "./layers";
import PixelKitStage from "./stage";
import { useConfiguration } from "./hooks/useConfiguration";
import SidebarRight from "./layout/SidebarRight";
import { css } from "@stylespixelkit/css";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "EDIT_IMAGE",
  });
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "240px 1fr 240px",
        backgroundColor: "black",
        flex: 1,
      })}
    >
      <p>left</p>

      <PixelKitStage>
        <PixelKitLayers />
      </PixelKitStage>
      <SidebarRight />
    </div>
  );
};
const ComponentApp = dynamic(Promise.resolve(PixelEditor), {
  ssr: false,
});

export default ComponentApp;
