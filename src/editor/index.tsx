import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import LayoutPixelEditor from "./layout";
import PixelKitShapes from "./shapes";
import PixelKitStage from "./Stage";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  return (
    <LayoutPixelEditor>
      <PixelKitStage>
        <PixelKitShapes />
      </PixelKitStage>
    </LayoutPixelEditor>
  );
};

export default PixelEditor;
