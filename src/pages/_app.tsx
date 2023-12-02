import AtomSeo from "@/components/atoms/AtomSeo/atomseo";
import useBrowser from "@/hooks/useBrowser/hook";
import useStopZoom from "@/hooks/useStopZoom/hook";
import LayoutFC from "@/layout";
import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useStopZoom();
  useBrowser();
  return (
    <>
      <AtomSeo
        title="Pixel Kit"
        content="pixels, kit, design, editor, react, nextjs"
        description="Pixel kit a open source design editor"
        url="https://pixel-kit.vercel.app/"
        image="/coverd.png"
      />
      <Toaster richColors expand={true} />
      <LayoutFC {...Component}>
        <Component {...pageProps} />
      </LayoutFC>
    </>
  );
};
export default App;
