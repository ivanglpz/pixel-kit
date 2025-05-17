import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { PixelKitLayers } from "./layers";
import { LayoutPixelEditorDraw } from "./layout/draw";
import PixelKitStage from "./stage";
import { useConfiguration } from "./hooks/useConfiguration";

const Component = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "FREE_DRAW",
  });
  return (
    <LayoutPixelEditorDraw>
      <PixelKitStage>
        <PixelKitLayers />
      </PixelKitStage>
    </LayoutPixelEditorDraw>
  );
};
const PixelEditorDraw = dynamic(Promise.resolve(Component), {
  ssr: false,
});
export default PixelEditorDraw;
