import icons from "@/assets";
import { Section } from "@/editor/components/section";
import { useSelectedShape, useTool } from "@/editor/hooks";
import { showClipAtom } from "@/editor/states/clipImage";
import { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";

const METHODS: { icon: JSX.Element; keyMethod: IKeyTool }[] = [
  {
    icon: icons.cursor,
    keyMethod: "MOVE",
  },

  {
    icon: icons.box,
    keyMethod: "BOX",
  },
  {
    icon: icons.circle,
    keyMethod: "CIRCLE",
  },
  {
    icon: icons.line,
    keyMethod: "LINE",
  },
  {
    icon: icons.image,
    keyMethod: "IMAGE",
  },
  {
    icon: icons.text,
    keyMethod: "TEXT",
  },

  {
    icon: icons.peentool,
    keyMethod: "DRAW",
  },
];

export const Tools = () => {
  const { tool, setTool } = useTool();
  const { handleCleanShapeSelected } = useSelectedShape();

  const setshowClip = useSetAtom(showClipAtom);

  const { config } = useConfiguration();

  return (
    <Section title="Tools">
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "md",
        })}
      >
        {METHODS?.filter((e) => config.tools.includes(e?.keyMethod))?.map(
          (item) => {
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
                })}
                onClick={() => {
                  setTool(item.keyMethod as IKeyTool);
                  handleCleanShapeSelected();
                  setshowClip(false);
                }}
              >
                {item?.icon}
              </button>
            );
          }
        )}
      </section>
    </Section>
  );
};
