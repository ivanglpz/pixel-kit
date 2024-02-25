import PixelKitShapes from "./elements";
import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import LayoutPixelEditor from "./layout";
import PixelKitStage from "@/editor/stage/index";
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
