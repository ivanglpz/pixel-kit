import WarningBrowserBraveModal from "@/components/atoms/AtomModal";
import AtomSeo from "@/components/atoms/AtomSeo/atomseo";
import useBrowser from "@/hooks/useBrowser/hook";
import useStopZoom from "@/hooks/useStopZoom/hook";
import LayoutFC from "@/layout";
import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useStopZoom();
  useBrowser();
  return (
    <>
      <AtomSeo
        title="Pixel Kit"
        content="pixels, kit, design, editor, react, nextjs"
        description="Pixel Kit is a powerful open-source editing tool designed to transform your ideas into stunning visual masterpieces. With an intuitive approach and advanced tools, this application provides a comprehensive experience for image editing, design creation, and PDF document generation"
        url="https://pixel-kit.vercel.app/"
      />
      <Toaster
        richColors
        expand={true}
        className={css({
          zIndex: 99999999999999,
        })}
      />
      <WarningBrowserBraveModal />

      <LayoutFC {...Component}>
        <Component {...pageProps} />
      </LayoutFC>
    </>
  );
};
export default App;
