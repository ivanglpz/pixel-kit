import SeoComponent from "@/components/seo";
import { NextOnlyPage } from "next";

const PageEditor: NextOnlyPage = () => {
  return (
    <>
      <SeoComponent
        image="https://res.cloudinary.com/whil/image/upload/v1712288225/app/pixel-kit/images/qvx8i84doj1fgfemx2th.png"
        title="Pixel Kit Image Editing Mode"
        content="Pixel Kit, Image Editing Mode, Transform, Refine, Photos, Powerful Editing Tools, Elevate Images"
        description="Transform and refine your photos effortlessly with Pixel Kit's Image Editing Mode. Unlock a range of powerful editing tools and elevate your images to the next level. Try it now!"
        url="https://pixel-kit.vercel.app/editor"
      />
      <p>hello world</p>
    </>
  );
};
// Redirección con SSR hacia /app
export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/app",
      permanent: false, // cambiar a true si quieres que sea redirección permanente
    },
  };
};
export default PageEditor;
