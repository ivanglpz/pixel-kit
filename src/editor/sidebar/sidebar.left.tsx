import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { FC } from "react";
import { Nodes } from "../components/Nodes";
import { Segmentation } from "../components/segmentation";
import SHAPES_ATOM, { CLEAR_SHAPES_ATOM } from "../states/shapes";

export const SidebarLeft: FC = () => {
  const SHAPES = useAtomValue(SHAPES_ATOM);
  const CLEAR = useSetAtom(CLEAR_SHAPES_ATOM);
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
          <section
            className={css({
              paddingBottom: "lg",
            })}
          >
            <div
              className={css({
                display: "flex",
                flexDirection: "row",
                gap: "sm",
                alignItems: "center",
                justifyContent: "space-between",
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
                paddingTop: "md",
                paddingLeft: "lg",
              })}
            >
              {Array.from({ length: 5 })?.map((e, index) => {
                return (
                  <li
                    key={`page-${index}`}
                    className={css({
                      py: "md",
                    })}
                  >
                    <p
                      className={css({
                        fontSize: "sm",
                      })}
                    >
                      Components {index + 1}
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
              marginBottom: "lg",
            })}
          ></div>
          <ul
            className={css({
              zIndex: 9,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "md",
              // overflowX: "scroll",
              overflowY: "scroll",
              borderRight: "1px solid gray",
            })}
          >
            {SHAPES?.map((e) => {
              return <Nodes key={`main-nodes-${e?.id}-${e?.tool}`} item={e} />;
            })}
          </ul>
        </Segmentation.Item>
        <Segmentation.Item id="2" title="Assets">
          <p>Contenido 2</p>
        </Segmentation.Item>
      </Segmentation>
    </aside>
  );
};
