import dynamic from "next/dynamic";
import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import { PixelKitLayers } from "./layers";
import { LayoutPixelEditorDraw } from "./layout/draw";
import PixelKitStage from "./Stage";

const Component = () => {
  useStopZoom();
  useBrowser();
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
