import { TabsProjects } from "@/components/tabs";

import { css } from "@stylespixelkit/css";
import { Plus_Jakarta_Sans } from "next/font/google";
import React, { ReactNode } from "react";

const jkrt = Plus_Jakarta_Sans({ subsets: ["latin"] });

// 1. Definir los nombres de layout válidos
export type LayoutKey = "App" | "Editor" | "Default";

// 2. Definir la firma de un layout
interface LayoutProps {
  children: ReactNode;
}

const App: React.FC<LayoutProps> = ({ children }) => (
  <main
    className={`${jkrt.className} ${css({
      backgroundColor: "bg",
      height: "100dvh",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    })}`}
  >
    <TabsProjects />
    <div className="grid grid-cols-1 h-full overflow-hidden">{children}</div>
  </main>
);
const Editor: React.FC<LayoutProps> = ({ children }) => (
  <header
    className={`${jkrt.className} ${css({
      backgroundColor: "bg",
      height: "100dvh",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    })}`}
  >
    <TabsProjects />

    {children}
  </header>
);

const Default: React.FC<LayoutProps> = ({ children }) => <>{children}</>;

// 4. Mapa entre claves y componentes
export const Layout: Record<LayoutKey, React.FC<LayoutProps>> = {
  App,
  Editor,
  Default,
};
