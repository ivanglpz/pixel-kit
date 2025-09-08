/* eslint-disable react-hooks/exhaustive-deps */
import InputColor from "@/editor/components/input-color";
import { useAtom } from "jotai";
import { FC } from "react";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

export const StageCanvasColor: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);

  return (
    <InputColor
      color={config}
      onChangeColor={(bg) => setConfig(bg)}
      labelText="Canvas color"
      keyInput="canvas-bg"
    />
  );
};
