/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import { FC } from "react";
import { Input } from "../components/input";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

export const StageCanvasColor: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);

  return (
    <Input.Container>
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
  );
};
