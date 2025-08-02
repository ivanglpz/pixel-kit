import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { FC } from "react";
import { Nodes } from "../components/Nodes";
import { Segmentation } from "../components/segmentation";
import { CHANGE_PARENTID_NODE_ATOM } from "../states/nodes";
import ALL_SHAPES_ATOM, {
  CLEAR_SHAPES_ATOM,
  ROOT_SHAPES_ATOM,
} from "../states/shapes";

export const SidebarLeft: FC = () => {
  const ROOT_SHAPES = useAtomValue(ROOT_SHAPES_ATOM);
  const ALL_SHAPES = useAtomValue(ALL_SHAPES_ATOM);
  const CLEAR = useSetAtom(CLEAR_SHAPES_ATOM);
  const SET_PARENT_CHANGE = useSetAtom(CHANGE_PARENTID_NODE_ATOM);

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    SET_PARENT_CHANGE({ endId: null });

    // CLEAR_PARENT({ endId: null }); // <- Esto quitará el parentId
  };

  return (
    <aside
      className={css({
        padding: "lg",
        backgroundColor: "bg",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: "border", // ← usa el semantic token
        overflow: "hidden",
      })}
    >
      <Segmentation>
        <Segmentation.Item id="1" title="Layers">
          <div
            className={css({
              display: "grid",
              gridTemplateRows: "240px 1px 1fr",
              overflow: "hidden",
              height: "100%",
              gap: "lg",
            })}
          >
            <section
              className={css({
                display: "flex",
                flexDirection: "column",
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "row",
                  gap: "sm",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "lg",
                })}
              >
                <p
                  className={css({
                    fontSize: "md",
                    fontWeight: 600,
                  })}
                >
                  Pages
                </p>
                <button
                  className={css({
                    display: "flex",
                    flexDirection: "row",
                    gap: "sm",
                    alignItems: "center",
                  })}
                >
                  <Plus size={14} />
                  <p
                    className={css({
                      fontSize: "sm",
                    })}
                  >
                    Add
                  </p>
                </button>
              </div>
              <ul
                className={css({
                  overflowY: "scroll",
                  height: "100%",
                })}
              >
                {Array.from({ length: 25 })?.map((e, index) => {
                  return (
                    <li
                      key={`page-${index}`}
                      className={css({
                        padding: "md",
                        _hover: {
                          backgroundColor: "gray.100",
                          _dark: {
                            backgroundColor: "gray.800",
                          },
                        },
                      })}
                    >
                      <p
                        className={css({
                          fontSize: "sm",
                        })}
                      >
                        My page {index + 1}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
            <div
              className={css({
                backgroundColor: "gray.500",
                width: "100%",
                height: 1,
                // paddingBottom: "lg",
              })}
            ></div>
            <ul
              className={css({
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "md",
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
          </div>
        </Segmentation.Item>
        <Segmentation.Item id="2" title="Assets">
          <p>Contenido 2</p>
        </Segmentation.Item>
      </Segmentation>
    </aside>
  );
};
