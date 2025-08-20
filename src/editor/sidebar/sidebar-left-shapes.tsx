import { Nodes } from "@/editor/components/Nodes";
import { CHANGE_PARENTID_NODE_ATOM } from "@/editor/states/nodes";
import ALL_SHAPES_ATOM, { ROOT_SHAPES_ATOM } from "@/editor/states/shapes";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";

export const SidebarLeftShapes = () => {
  const ROOT_SHAPES = useAtomValue(ROOT_SHAPES_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENTID_NODE_ATOM);

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    SET_PARENT_CHANGE({ endId: null });
  };

  return (
    <ul
      className={css({
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
      })}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOutside}
    >
      {ROOT_SHAPES?.map((e) => {
        return (
          <Nodes
            key={`main-nodes-${e?.id}-${e?.tool}`}
            SHAPES={ALL_SHAPES}
            item={e}
          />
        );
      })}
    </ul>
  );
};
