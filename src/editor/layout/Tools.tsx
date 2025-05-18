import icons from "@/assets";
import { Section } from "@/editor/components/section";
import { useSelectedShape, useTool } from "@/editor/hooks";
import { showClipAtom } from "@/editor/states/clipImage";
import { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";

export const Tools = () => {
  const { tool, setTool } = useTool();
  const { handleCleanShapeSelected } = useSelectedShape();

  const setshowClip = useSetAtom(showClipAtom);

  const { config } = useConfiguration();

  return (
    <Section title="Tools">
      <section
        className={css({
          display: "grid",
          gap: "md",
          gridTemplateColumns: "4",
        })}
      >
        {config.tools?.map((item) => {
          const isSelected = item?.keyMethod === tool;
          return (
            <button
              key={`sidebar-methods-key-${item.keyMethod}`}
              className={css({
                backgroundGradient: isSelected ? "primary" : "transparent",
                borderRadius: "6px",
                width: "40px",
                height: "35px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "container",
                cursor: "pointer",
                flexGrow: 1,
                position: "relative",
              })}
              onClick={() => {
                setTool(item.keyMethod as IKeyTool);
                handleCleanShapeSelected();
                setshowClip(false);
              }}
            >
              {item?.icon}
              <div
                className={css({
                  position: "absolute",
                  right: -5,
                  bottom: -5,
                  backgroundGradient: isSelected ? "primary" : "transparent",
                  backgroundColor: "primary",
                  width: 10,
                  height: 15,
                  zIndex: 100,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "9",
                  borderRadius: "4px",
                })}
              >
                <p
                  className={css({
                    fontSize: "x-small",
                    color: "text",
                    fontWeight: "bold",
                  })}
                >
                  {item.keyBoard}
                </p>
              </div>
            </button>
          );
        })}
      </section>
    </Section>
  );
};
