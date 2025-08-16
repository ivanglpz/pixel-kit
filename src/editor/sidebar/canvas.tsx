/* eslint-disable react-hooks/exhaustive-deps */
import InputColor from "@/editor/components/input-color";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { FC, useEffect } from "react";
import STAGE_CANVAS_BACKGROUND, { canvasTheme } from "../states/canvas";

export const StageCanvasColor: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);
  const { systemTheme } = useTheme();

  useEffect(() => {
    if (!systemTheme) return;
    setConfig(canvasTheme[systemTheme]);
  }, [systemTheme]);

  return (
    <InputColor
      color={config}
      onChangeColor={(bg) => setConfig(bg)}
      labelText="Canvas color"
      keyInput="canvas-bg"
    />
  );
};
