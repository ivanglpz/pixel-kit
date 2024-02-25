import useBrowser from "@/hooks/useBrowser/hook";
import useStopZoom from "@/hooks/useStopZoom/hook";
import LayoutFC from "@/layout";
import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
import dynamic from "next/dynamic";
import SeoComponent from "@/components/seo";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useStopZoom();
  useBrowser();
  return (
    <>
      <SeoComponent
        title="Pixel Kit"
        content="pixels, kit, design, editor, react, nextjs"
        description="Transform ideas into visual masterpieces with Pixel Kit, a potent open-source editing tool. Elevate your creative projects through intuitive design, advanced image editing, and seamless PDF document generation."
        url="https://pixel-kit.vercel.app/"
      />
      <Toaster
        richColors
        expand={true}
        className={css({
          zIndex: 99999999999999,
        })}
      />

      <LayoutFC {...Component}>
        <Component {...pageProps} />
      </LayoutFC>
    </>
  );
};
const ComponentApp = dynamic(Promise.resolve(App), {
  ssr: false,
});

export default ComponentApp;
