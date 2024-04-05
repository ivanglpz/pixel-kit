import "@/styles/globals.css";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
import { Analytics } from "@vercel/analytics/react";

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <>
      <Analytics />

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
