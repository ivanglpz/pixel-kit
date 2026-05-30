import { Layout } from "@/layout/layouts";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Provider as JotaiProvider } from "jotai";
import { NextPage } from "next";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { css } from "../../styled-system/css";

// If loading a variable font, you don't need to specify the font weight
export type LayoutKey = keyof typeof Layout;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: LayoutKey;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const LayoutProvider =
    Layout[Component.layout ?? "Default"] || Layout.Default;

  return (
    <>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Analytics />

            <Toaster
              richColors
              expand={true}
              className={css({
                zIndex: 99999999999999,
              })}
            />
            <LayoutProvider>
              <Component {...pageProps} />
            </LayoutProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </JotaiProvider>
    </>
  );
};

export default App;
