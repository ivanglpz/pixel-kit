/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import { FC } from "react";
import { Input } from "../components/input";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";
import { START_TIMER_ATOM } from "../states/timer";

export const SidebarRightColorBg: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);
  const START = useSetAtom(START_TIMER_ATOM);

  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })}
    >
      <Input.Label text="Color" />
      <Input.Container id={`pixel-kit-canvas-color`}>
        <Input.Grid>
          <Input.IconContainer>
            <Input.Color
              id={`pixel-kit-canvas-color`}
              value={config}
              onChange={(bg) => {
                START();
                setConfig(bg);
              }}
            />
          </Input.IconContainer>
          <Input.Label text={`#${config?.replace(/#/, "") ?? "ffffff"}`} />
        </Input.Grid>
      </Input.Container>
    </section>
  );
};
