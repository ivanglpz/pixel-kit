import PixelKitShapes from "./elements";
import LayoutPixelEditor from "./layout";
import PixelKitEditorStage from "./stage";

const PixelEditor = () => {
  return (
    <LayoutPixelEditor>
      <PixelKitEditorStage>
        <PixelKitShapes />
      </PixelKitEditorStage>
    </LayoutPixelEditor>
  );
};

export default PixelEditor;
