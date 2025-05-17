import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/AllLayers";
import PxStage from "./stage";
import { useConfiguration } from "./hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import SidebarRight from "./layout/SidebarRight";

const Component = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "FREE_DRAW",
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
