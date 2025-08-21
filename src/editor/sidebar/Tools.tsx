import { SHOW_CLIP_ATOM } from "@/editor/states/clipImage";
import TOOL_ATOM, { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";
import { EVENT_ATOM, IStageEvents } from "../states/event";
import { RESET_SHAPES_IDS_ATOM } from "../states/shape";

export const Tools = () => {
  const [tool, setTool] = useAtom(TOOL_ATOM);
  const [showClip, setshowClip] = useAtom(SHOW_CLIP_ATOM);

  const { config } = useConfiguration();
  // const setShapeId = useSetAtom(SHAPE_ID_ATOM);
  const resetShapesIds = useSetAtom(RESET_SHAPES_IDS_ATOM);
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
        if (item?.isSeparation) {
          return (
            <div
              key={`separator-$${index}`}
              className={css({
                height: "25px",
                width: 1,
                backgroundColor: "gray.500",
              })}
            />
          );
        }
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
                  resetShapesIds();
                  setshowClip(false);
                  return;
                }
                setTool(item.keyMethod as IKeyTool);
                setEventStage(item.eventStage as IStageEvents);
                resetShapesIds();

                setshowClip(true);

                return;
              }
              setTool(item.keyMethod as IKeyTool);
              setEventStage(item.eventStage as IStageEvents);
              resetShapesIds();
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
