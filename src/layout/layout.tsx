import { useRouter } from "next/router";
import { JSX, ReactNode } from "react";
import { LayoutApp } from "./app";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const router = useRouter();

  if (router.pathname.startsWith("/app")) {
    return <LayoutApp>{children}</LayoutApp>;
  }

  return <>{children}</>; // importante envolver en fragment
};
