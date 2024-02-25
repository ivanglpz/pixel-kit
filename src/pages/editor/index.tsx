import PixelKitEditor from "@/editor/Stage";
import PixelKitShapes from "@/editor/core/elements";
import { NextOnlyPage } from "next";

const PageEditor: NextOnlyPage = () => {
  return (
    <PixelKitEditor>
      <PixelKitShapes />
    </PixelKitEditor>
  );
};

PageEditor.Layout = "editor";

export default PageEditor;
