import PixelKitInputColor from "@/editor/components/input-color";
import { useAtom } from "jotai";
import { FC } from "react";
import STAGE_CANVAS_BACKGROUND from "../states/canvas";

const StageConfig: FC = () => {
  const [config, setConfig] = useAtom(STAGE_CANVAS_BACKGROUND);

  return (
    <PixelKitInputColor
      color={config?.backgroundColor}
      onChangeColor={(backgroundColor) =>
        setConfig({
          backgroundColor,
        })
      }
      labelText="Canvas color"
      primaryColors
      keyInput="canvas-bg"
    />
  );
};

export default StageConfig;
