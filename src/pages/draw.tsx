import SeoComponent from "@/components/seo";
import PixelEditorDraw from "@/editor/draw";
import { NextOnlyPage } from "next";

const PageEditor: NextOnlyPage = () => {
  return (
    <>
      <SeoComponent
        image="https://res.cloudinary.com/whil/image/upload/v1712286836/app/pixel-kit/images/o0zgnywnnroimc8ipzw9.png"
        title="Pixel Kit Freehand Mode"
        content="Pixel Kit, Freehand Mode, Sketch, Doodle, Artwork, Intuitive Tools, Create"
        description="Sketch and doodle with Pixel Kit's Freehand Mode. Create unique artwork on your photos with intuitive drawing tools. Try it now!"
        url="https://pixel-kit.vercel.app/draw"
      />
      <PixelEditorDraw />
    </>
  );
};

export default PageEditor;
