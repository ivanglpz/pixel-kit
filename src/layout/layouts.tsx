import { TabsProjects } from "@/components/tabs";

import { css } from "@stylespixelkit/css";
import { User } from "lucide-react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

const jkrt = Plus_Jakarta_Sans({ subsets: ["latin"] });

// 1. Definir los nombres de layout válidos
export type LayoutKey = "App" | "Editor" | "Default" | "Settings";

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
const Settings: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  return (
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
      <section
        className={css({
          padding: "lg",
          gap: "xlg",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100%",
        })}
      >
        <div className="grid grid-cols-[220px_1fr] h-full overflow-hidden">
          <aside className="h-full w-full border-r flex flex-col items-start p-2">
            <p className="pb-4">
              <strong className="text-lg">Settings</strong>
            </p>
            <p className="text-xs opacity-75">User settings</p>
            <button
              onClick={() => {
                router.push("/app/settings");
              }}
              className="w-full cursor-pointer flex items-center gap-2 justify-start py-3"
            >
              <User size={18} />
              <p className="text-sm">Account</p>
            </button>
          </aside>
          {children}
        </div>
      </section>
    </header>
  );
};

const Default: React.FC<LayoutProps> = ({ children }) => <>{children}</>;

// 4. Mapa entre claves y componentes
export const Layout: Record<LayoutKey, React.FC<LayoutProps>> = {
  App,
  Editor,
  Default,
  Settings,
};
