import TOOL_ATOM, { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";
import { EVENT_ATOM, IStageEvents } from "../states/event";

export const Tools = () => {
  const [tool, setTool] = useAtom(TOOL_ATOM);

  const { config } = useConfiguration();
  const setEventStage = useSetAtom(EVENT_ATOM);
  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        gap: "md",
        left: -1,
        top: -2,
        backgroundColor: "bg",
        padding: "md",
        borderTopRightRadius: "lg",
        borderBottomRightRadius: "lg",
        borderWidth: "1.5px",
        borderStyle: "solid",
        zIndex: "10",
        borderColor: "border",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
          alignItems: "center",
        })}
      >
        {config.tools?.map((item) => {
          const isSelected = item?.keyMethod === tool;

          return (
            <button
              key={`sidebar-methods-key-${item.keyMethod}`}
              className={`${css({
                backgroundColor: isSelected ? "primary" : "transparent",
                borderRadius: "6px",
                width: "30px",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                position: "relative",
              })} ${isSelected ? "tool-stroke-active" : ""}`}
              onClick={() => {
                setTool(item.keyMethod as IKeyTool);
                setEventStage(item.eventStage as IStageEvents);
              }}
            >
              {item?.icon}
            </button>
          );
        })}
      </div>
    </section>
  );
};
