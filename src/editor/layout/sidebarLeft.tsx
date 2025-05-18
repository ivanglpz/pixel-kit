import { FC } from "react";
import { css } from "@stylespixelkit/css";
import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { useAtomValue } from "jotai";
import SHAPES_ATOM from "../states/shapes";
import { Nodes } from "../components/Nodes";

export const SidebarLeft: FC = () => {
  const { config } = useConfiguration();

  const SHAPES = useAtomValue(SHAPES_ATOM);
  return (
    <aside
      className={css({
        backgroundColor: "rgba(0,0,0,0.15)",
        zIndex: 9,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        overflow: "hidden",
        overflowX: "scroll",
        overflowY: "scroll",
        padding: "md",
        borderRight: "1px solid gray",
        height: "100%",
      })}
    >
      {SHAPES?.map((e) => {
        return <Nodes key={`main-nodes-${e?.id}-${e?.tool}`} item={e} />;
      })}
    </aside>
  );
};
