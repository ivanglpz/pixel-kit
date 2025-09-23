import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LayoutApp } from "./app";

export const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  if (router.pathname.startsWith("/app")) {
    return <LayoutApp>{children}</LayoutApp>;
  }
  return children;
};
