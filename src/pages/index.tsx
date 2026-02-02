import { CTA } from "@/components/home-cta";
import { Customization } from "@/components/home-customization";
import { Features } from "@/components/home-features";
import { Footer } from "@/components/home-footer";
import { Hero } from "@/components/home-hero";
import SeoComponent from "@/components/seo";
import { css } from "@stylespixelkit/css";
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
      <section
        className={css({
          padding: "lg",
          gap: "xlg",
          display: "flex",
          flexDirection: "column",
        })}
      >
        <Hero />
        <Features />
        <Customization />
        <CTA />
      </section>
      <Footer />
    </>
  );
};
PageEditor.layout = "Default";
// Redirección con SSR hacia /app

export default PageEditor;
