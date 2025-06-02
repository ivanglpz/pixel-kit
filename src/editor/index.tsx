import { css } from "@stylespixelkit/css";
import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import { useConfiguration } from "./hooks/useConfiguration";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/AllLayers";
import { HeaderLogo } from "./layout/HeaderLogo";
import { SidebarLeft } from "./layout/sidebarLeft";
import SidebarRight from "./layout/SidebarRight";
import PxStage from "./stage";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "EDIT_IMAGE",
  });
  return (
    <div
      id="pixel-app"
      className={css({
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "35px 1fr",
      })}
    >
      <header
        className={css({
          padding: "md",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid gray",
        })}
      >
        <HeaderLogo />
      </header>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          backgroundColor: "black",
          height: "100%",
          width: "100%",
          overflow: "hidden",
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
