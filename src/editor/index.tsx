import { css } from "@stylespixelkit/css";
import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import { useConfiguration } from "./hooks/useConfiguration";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/root.layers";
import { HeaderLogo } from "./sidebar/HeaderLogo";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
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
