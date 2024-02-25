import { useStage, useTool } from "@/editor/core/hooks";
import { css } from "@stylespixelkit/css";
import { FC } from "react";

const StageConfig: FC = () => {
  const { config, handleConfig } = useStage();

  return (
    <div
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
      })}
    >
      <div>
        <p
          className={css({
            fontSize: "md",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Appearance
        </p>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "normal",
            opacity: 0.7,
          })}
        >
          Change canvas settings.
        </p>
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
        })}
      >
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "normal",
            opacity: 0.7,
          })}
        >
          Background
        </p>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            gap: "lg",
            height: "100%",
          })}
        >
          <label
            htmlFor="backgroundStage"
            className={css({
              height: "30px",
              width: "30px",
              borderRadius: "md",
              border: "container",
              display: "flex",
              padding: "sm",
            })}
            style={{
              backgroundColor: config?.backgroundColor ?? "#ffffff",
            }}
          >
            <input
              type="color"
              id="backgroundStage"
              className={css({
                margin: 0,
                outline: "none",
                padding: 0,
                border: "none",
                opacity: 0,
                height: 0,
                width: 0,
              })}
              value={config.backgroundColor}
              onChange={(event) =>
                handleConfig({
                  backgroundColor: event.target.value,
                })
              }
            />
          </label>
          <input
            type="text"
            value={`#${config?.backgroundColor?.replace(/#/, "") ?? "ffffff"}`}
            className={css({
              width: "10",
              flex: 1,
              border: "container",
              backgroundColor: "transparent",
              color: "text",
              padding: "sm",
              height: "30px",
              borderRadius: "md",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default StageConfig;
