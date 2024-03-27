import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import { PixelKitLayers } from "./layers";
import { LayoutPixelEditorDraw } from "./layout/draw";
import PixelKitStage from "./Stage";

export const PixelEditorDraw = () => {
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
