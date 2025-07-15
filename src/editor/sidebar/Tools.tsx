import { useTool } from "@/editor/hooks";
import { showClipAtom } from "@/editor/states/clipImage";
import { IKeyTool } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useConfiguration } from "../hooks/useConfiguration";
import { EVENT_ATOM, IStageEvents } from "../states/event";
import { SHAPE_ID_ATOM } from "../states/shape";

export const Tools = () => {
  const { tool, setTool } = useTool();

  const setshowClip = useSetAtom(showClipAtom);

  const { config } = useConfiguration();
  const setShapeId = useSetAtom(SHAPE_ID_ATOM);
  const setEventStage = useSetAtom(EVENT_ATOM);
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
        gap: "lg",
      })}
    >
      {config.tools?.map((item, index) => {
        const isSelected = item?.keyMethod === tool;
        if (item?.isSeparation) {
          return (
            <div
              key={`separator-$${index}`}
              className={css({
                backgroundColor: "#242424",
                height: "32px",
                width: 1,
              })}
            />
          );
        }
        return (
          <button
            key={`sidebar-methods-key-${item.keyMethod}`}
            className={css({
              backgroundGradient: isSelected ? "primary" : "",
              borderRadius: "6px",
              width: "30px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            })}
            onClick={() => {
              setTool(item.keyMethod as IKeyTool);
              setEventStage(item.eventStage as IStageEvents);
              setShapeId(null);
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
