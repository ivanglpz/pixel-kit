import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import TOOL_ATOM, { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";
import { EVENT_ATOM, IStageEvents } from "../states/event";

export const Tools = () => {
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const [showClip, setshowClip] = useAtom(SHOW_CLIP_ATOM);

  const { config } = useConfiguration();
  // const setShapeId = useSetAtom(SHAPE_ID_ATOM);
  const setEventStage = useSetAtom(EVENT_ATOM);
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
        gap: "lg",
        alignItems: "center",
      })}
    >
      {config.tools?.map((item, index) => {
        const isSelected = item?.keyMethod === tool;

        return (
          <button
            key={`sidebar-methods-key-${item.keyMethod}`}
            className={`${css({
              backgroundColor: isSelected ? "primary" : "",
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
              if (item.keyMethod === "CLIP") {
                if (showClip) {
                  setTool("MOVE");
                  setEventStage("IDLE");
                  setshowClip(false);
                  return;
                }
                setTool(item.keyMethod as IKeyTool);
                setEventStage(item.eventStage as IStageEvents);

                setshowClip(true);

                return;
              }
              setTool(item.keyMethod as IKeyTool);
              setEventStage(item.eventStage as IStageEvents);
              setshowClip(!showClip);
              setshowClip(false);
            }}
          >
            {item?.icon}
          </button>
        );
      })}
    </div>
  );
};
