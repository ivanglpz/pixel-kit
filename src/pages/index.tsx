import PixelEditor from "@/editor";
import { NextOnlyPage } from "next";

const PageEditor: NextOnlyPage = () => {
  return <PixelEditor />;
};

PageEditor.Layout = "editor";

export default PageEditor;
