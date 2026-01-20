/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { useAtom } from "jotai";
import { FC } from "react";
import { Input } from "../components/input";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

export const SidebarRightColorBg: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);

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
              onChange={(bg) => setConfig(bg)}
            />
          </Input.IconContainer>
          <Input.Label text={`#${config?.replace(/#/, "") ?? "ffffff"}`} />
        </Input.Grid>
      </Input.Container>
    </section>
  );
};
