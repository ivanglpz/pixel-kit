import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
import { Analytics } from "@vercel/analytics/react";
import SeoComponent from "@/components/seo";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <>
      <Analytics />
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

export default App;
