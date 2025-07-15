import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import type { AppPropsWithLayout } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Analytics />

        <Toaster
          richColors
          expand={true}
          className={css({
            zIndex: 99999999999999,
          })}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;
