import AtomSeo from "@/components/atoms/AtomSeo/atomseo";
import useStopZoom from "@/hooks/useStopZoom/hook";
import LayoutFC from "@/layout";
import "@/styles/globals.css";
import { Provider } from "jotai";
import PlausibleProvider from "next-plausible";
import type { AppPropsWithLayout } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useStopZoom();
  return (
    <PlausibleProvider domain="harmony.whil.online">
      <Provider>
        <AtomSeo
          title="Pixel Kit"
          content="pixels, kit, design, editor, react, nextjs"
          description="Pixel kit a open source design editor"
          url="https://pixel-kit.vercel.app/"
          image="/coverd.png"
        />
        <Toaster richColors />
        <LayoutFC {...Component}>
          <Component {...pageProps} />
        </LayoutFC>
      </Provider>
    </PlausibleProvider>
  );
};
export default App;
