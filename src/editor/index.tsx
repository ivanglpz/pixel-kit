import { css } from "@stylespixelkit/css";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import { useConfiguration } from "./hooks/useConfiguration";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/root.layers";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
import { Tools } from "./sidebar/Tools";
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
        gridTemplateRows: "60px 1fr",
      })}
    >
      <header
        className={css({
          padding: "lg",
          display: "grid",
          alignItems: "center",
          borderBottom: "1px solid gray",
          gridTemplateColumns: "3",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "lg",
          })}
        >
          <Menu color="white" size={28} />
          <p
            className={css({
              color: "white",
              fontSize: "sm",
              fontWeight: 600,
            })}
          >
            Draft /{" "}
            <span
              className={css({
                opacity: 0.5,
              })}
            >
              My file01
            </span>
          </p>
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "md",
          })}
        >
          <Tools />
        </div>
        <div>
          <p>hello</p>
        </div>
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
