import { TABS_PERSIST_ATOM } from "@/editor/states/tabs";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";
import { ReactNode } from "react";

export const AuthProjects = ({ children }: { children: ReactNode }) => {
  const PROJECTS = useAtomValue(TABS_PERSIST_ATOM);
  if (!PROJECTS.length)
    return (
      <div
        className={css({
          padding: "lg",
        })}
      >
        <p>Please select or create a project to start.</p>
      </div>
    );
  return children;
};
