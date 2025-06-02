import { useConfiguration } from "@/editor/hooks/useConfiguration";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { FC } from "react";
import { Nodes } from "../components/Nodes";
import { Section } from "../components/section";
import SHAPES_ATOM, { CLEAR_SHAPES_ATOM } from "../states/shapes";

export const SidebarLeft: FC = () => {
  const { config } = useConfiguration();

  const SHAPES = useAtomValue(SHAPES_ATOM);
  const CLEAR = useSetAtom(CLEAR_SHAPES_ATOM);
  return (
    <ul
      className={css({
        backgroundColor: "rgba(0,0,0,0.15)",
        zIndex: 9,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        overflowX: "scroll",
        overflowY: "scroll",
        padding: "md",
        borderRight: "1px solid gray",
        height: "100%",
      })}
    >
      <Section
        title="Shapes"
        onDelete={CLEAR}
        onDeleteLabel="Clear all"
      ></Section>
      {SHAPES?.map((e) => {
        return <Nodes key={`main-nodes-${e?.id}-${e?.tool}`} item={e} />;
      })}
    </ul>
  );
};
