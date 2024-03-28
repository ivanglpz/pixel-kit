import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
import dynamic from "next/dynamic";
import SeoComponent from "@/components/seo";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <>
      <SeoComponent
        image="/home/editorimages.png"
        title="Pixel Kit - v1"
        content="pixels, kit, design, editor, react, nextjs"
        description="Transform ideas into visual masterpieces with Pixel Kit, a potent open-source editing tool. Elevate your creative projects through intuitive design, advanced image editing."
        url="https://pixel-kit.vercel.app/"
      />
      <Toaster
        richColors
        expand={true}
        className={css({
          zIndex: 99999999999999,
        })}
      />

      <Component {...pageProps} />
    </>
  );
};
const ComponentApp = dynamic(Promise.resolve(App), {
  ssr: false,
});

export default ComponentApp;
