import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useState } from "react";
import { Toaster } from "sonner";
import "../../../../src/styles/globals.css";

export default function DesktopApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
        <Toaster richColors expand />
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
