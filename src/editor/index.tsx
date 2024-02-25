import PixelKitShapes from "./elements";
import useBrowser from "./hooks/useBrowser/hook";
import useStopZoom from "./hooks/useStopZoom/hook";
import LayoutPixelEditor from "./layout";
import PixelKitEditorStage from "./stage";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  return (
    <LayoutPixelEditor>
      <PixelKitEditorStage>
        <PixelKitShapes />
      </PixelKitEditorStage>
    </LayoutPixelEditor>
  );
};

export default PixelEditor;
