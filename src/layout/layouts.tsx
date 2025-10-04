import { TabsProjects } from "@/components/tabs";

import { css } from "@stylespixelkit/css";
import React, { ReactNode } from "react";

// 1. Definir los nombres de layout válidos
export type LayoutKey = "App" | "Editor" | "Default";

// 2. Definir la firma de un layout
interface LayoutProps {
  children: ReactNode;
}

const App: React.FC<LayoutProps> = ({ children }) => (
  <header
    className={css({
      backgroundColor: "bg",
      height: "100dvh",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    })}
  >
    <TabsProjects />
    <div className="grid grid-cols-1 h-full overflow-hidden">
      {/* <aside
        className={css({
          padding: "lg",
          backgroundColor: "bg",
          borderRightWidth: "1px",
          borderRightStyle: "solid",
          borderRightColor: "border", // ← usa el semantic token
          display: "flex",
          flexDirection: "column",
          gap: "lg",
        })}
      >
        <Profile />
        <Link
          href={"/app/organizations"}
          className={css({
            paddingLeft: "sm",
            paddingTop: "sm",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "lg",
          })}
        >
          <Building size={18} />
          <p
            className={css({
              fontSize: "sm",
              fontWeight: "600",
            })}
          >
            Organizations
          </p>
        </Link>
      </aside> */}
      {children}
    </div>
  </header>
);
const Editor: React.FC<LayoutProps> = ({ children }) => (
  <header
    className={css({
      backgroundColor: "bg",
      height: "100dvh",
      width: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    })}
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
