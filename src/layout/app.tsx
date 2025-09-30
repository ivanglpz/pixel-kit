import { TabsProjects } from "@/components/tabs";
import { css } from "@stylespixelkit/css";
import { ReactNode } from "react";

export const LayoutApp = ({ children }: { children: ReactNode }) => {
  return (
    <main
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
    </main>
  );
};
