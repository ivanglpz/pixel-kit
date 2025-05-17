import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/AllLayers";
import PxStage from "./stage";
import { useConfiguration } from "./hooks/useConfiguration";
import SidebarRight from "./layout/SidebarRight";
import { css } from "@stylespixelkit/css";
import { HeaderLogo } from "./layout/HeaderLogo";

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
          flex: 1,
          height: "100%",
          width: "100%",
        })}
      >
        <div
          className={css({
            borderRight: "1px solid gray",
          })}
        >
          <p>left</p>
        </div>

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
