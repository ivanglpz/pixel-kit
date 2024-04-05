import SeoComponent from "@/components/seo";
import PixelEditor from "@/editor";
import { NextOnlyPage } from "next";

const PageEditor: NextOnlyPage = () => {
  return (
    <>
      <SeoComponent
        image="https://res.cloudinary.com/whil/image/upload/v1712287405/app/pixel-kit/images/sylwxitf8lgyd7jguqyw.png"
        title="Pixel Kit Image Editing Mode"
        content="Pixel Kit, Image Editing Mode, Transform, Refine, Photos, Powerful Editing Tools, Elevate Images"
        description="Transform and refine your photos effortlessly with Pixel Kit's Image Editing Mode. Unlock a range of powerful editing tools and elevate your images to the next level. Try it now!"
        url="https://pixel-kit.vercel.app/editor"
      />
      <PixelEditor />
    </>
  );
};

export default PageEditor;
