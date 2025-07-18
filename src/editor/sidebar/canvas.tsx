import PixelKitInputColor from "@/editor/components/input-color";
import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { FC, useEffect } from "react";
import STAGE_CANVAS_BACKGROUND, { canvasTheme } from "../states/canvas";

const StageConfig: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);
  const { systemTheme } = useTheme();
  useEffect(() => {
    if (!systemTheme) return;
    setConfig(canvasTheme[systemTheme]);
  }, [systemTheme]);

  return (
    <PixelKitInputColor
      color={config}
      onChangeColor={(bg) => setConfig(bg)}
      labelText="Canvas color"
      keyInput="canvas-bg"
    />
  );
};

export default StageConfig;
