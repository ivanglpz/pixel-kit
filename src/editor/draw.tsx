import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/AllLayers";
import PxStage from "./stage";
import { useConfiguration } from "./hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import SidebarRight from "./layout/SidebarRight";
import { ChangeEnv } from "./components/ChangeEnv";

const Component = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "FREE_DRAW",
  });
  return (
    <div
      id="pixel-app"
      className={css({
        display: "grid",
        gridTemplateColumns: "240px 1fr 240px",
        backgroundColor: "black",
        flex: 1,
        height: "100%",
        width: "100%",
      })}
    >
      <p>left</p>
      <PxStage>
        <AllLayers />
      </PxStage>
      <SidebarRight />
    </div>
  );
};
const PixelEditorDraw = dynamic(Promise.resolve(Component), {
  ssr: false,
});
export default PixelEditorDraw;
