import PixelKitInputColor from "@/editor/components/input-color";
import { useAtom, useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { FC, useEffect } from "react";
import STAGE_CANVAS_BACKGROUND, { canvasTheme } from "../states/canvas";
import TOOL_ATOM from "../states/tool";

export const StageCanvasColor: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);
  const { systemTheme } = useTheme();
  const tool = useAtomValue(TOOL_ATOM);

  useEffect(() => {
    if (!systemTheme) return;
    setConfig(canvasTheme[systemTheme]);
  }, [systemTheme]);

  if (tool !== "MOVE") return null;

  return (
    <PixelKitInputColor
      color={config}
      onChangeColor={(bg) => setConfig(bg)}
      labelText="Canvas color"
      keyInput="canvas-bg"
    />
  );
};
